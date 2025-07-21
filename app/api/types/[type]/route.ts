import { NextRequest, NextResponse } from "next/server";
import { rtdb, storage } from "@/lib/firebase";
import { ref as dbRef, get, set, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

export async function GET(_: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;

  try {
    const typeRef = dbRef(rtdb, `types/${type}`);
    const snapshot = await get(typeRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    const data = snapshot.val();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;
  const body = await req.json();
  const { name, image, ingredients, instructions } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Missing or invalid item name" }, { status: 400 });
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const itemRef = dbRef(rtdb, `types/${type}/items/${name}`);

  try {
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      return NextResponse.json({ error: "Item with this name already exists" }, { status: 400 });
    }

    await set(itemRef, {
      image,
      ingredients: ingredients || "",
      instructions: instructions || "",
    });

    return NextResponse.json({ message: "Item created successfully" });
  } catch (err) {
    console.error("Create item error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ type: string }> }) {
  const { type: oldType } = await context.params;
  const body = await request.json();
  const { newType, image } = body;

  if (!newType && !image) {
    return NextResponse.json(
      { error: "At least newType or image must be provided" },
      { status: 400 }
    );
  }

  if (newType && typeof newType !== "string") {
    return NextResponse.json({ error: "newType must be a string" }, { status: 400 });
  }

  if (image && typeof image !== "string") {
    return NextResponse.json({ error: "image must be a string" }, { status: 400 });
  }

  try {
    const oldRef = dbRef(rtdb, `types/${oldType}`);
    const oldSnapshot = await get(oldRef);

    if (!oldSnapshot.exists()) {
      return NextResponse.json({ error: "Original type not found" }, { status: 404 });
    }

    const data = oldSnapshot.val();
    const previousImage: string | undefined = data.image;

    // If renaming
    if (newType && newType !== oldType) {
      const newRef = dbRef(rtdb, `types/${newType}`);
      const newSnapshot = await get(newRef);
      if (newSnapshot.exists()) {
        return NextResponse.json({ error: "A type with the new name already exists" }, { status: 409 });
      }

      if (image) {
        // Delete old image if new image is different
        if (previousImage && previousImage !== image) {
          try {
            const oldImagePath = extractStoragePathFromUrl(previousImage);
            const oldImageRef = storageRef(storage, oldImagePath);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.warn("Failed to delete previous image during rename:", err);
          }
        }
        data.image = image;
      }

      await set(newRef, data);
      await remove(oldRef);

      return NextResponse.json({ success: true, message: `Renamed ${oldType} to ${newType}` });
    } else {
      // Just update image (and delete old one if necessary)
      if (image) {
        if (previousImage && previousImage !== image) {
          try {
            const oldImagePath = extractStoragePathFromUrl(previousImage);
            const oldImageRef = storageRef(storage, oldImagePath);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.warn("Failed to delete previous image during update:", err);
          }
        }
        data.image = image;
      }

      await set(oldRef, data);
      return NextResponse.json({ success: true, message: `Updated type ${oldType}` });
    }
  } catch (err) {
    console.error("Error updating type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;

  try {
    const typePath = `types/${type}`;
    const typeRef = dbRef(rtdb, typePath);

    const snapshot = await get(typeRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    const typeData = snapshot.val();
    const imageUrl: string | undefined = typeData?.image;

    // Delete image from Firebase Storage if it exists
    if (imageUrl) {
      try {
        const storagePath = extractStoragePathFromUrl(imageUrl);
        const imgRef = storageRef(storage, storagePath);
        await deleteObject(imgRef);
      } catch (error) {
        console.warn("Image deletion failed:", error);
      }
    }

    // Delete the type from Realtime Database
    await remove(typeRef);

    return NextResponse.json({
      success: true,
      message: `Type '${type}' and its image (if any) have been deleted.`,
    });
  } catch (err) {
    console.error("Error deleting type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Utility to extract storage path from Firebase image URL
function extractStoragePathFromUrl(url: string): string {
  const match = decodeURIComponent(url).match(/\/o\/(.+?)\?alt=media/);
  if (!match || !match[1]) throw new Error("Failed to extract image path from URL");
  return match[1]; // like "type-images/my-image.jpg"
}
