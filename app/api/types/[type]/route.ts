import { NextRequest, NextResponse } from "next/server";
import { rtdb, storage } from "@/lib/firebase";
import { ref as dbRef, get, set, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

export async function GET(
  _: Request,
  context: { params: Promise<{ type: string }> },
) {
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
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ type: string }> },
) {
  const { type } = await context.params;
  const body = await req.json();
  const { name, image, ingredients, instructions } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid item name" },
      { status: 400 },
    );
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const itemRef = dbRef(rtdb, `types/${type}/items/${name}`);

  try {
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      return NextResponse.json(
        { error: "Item with this name already exists" },
        { status: 400 },
      );
    }

    await set(itemRef, {
      image,
      completions: 0,
      ingredients: ingredients || "",
      instructions: instructions || "",
    });

    return NextResponse.json({ message: "Item created successfully" });
  } catch (err) {
    console.error("Create item error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ type: string }> },
) {
  const { type: oldType } = await context.params;
  const body = await request.json();
  const { newType, image, completions } = body;

  // Check at least one update field is provided
  if (!newType && !image && completions === undefined) {
    return NextResponse.json(
      { error: "At least newType, image, or completions must be provided" },
      { status: 400 },
    );
  }

  // Validation rules
  const validators: Record<string, (v: any) => boolean> = {
    newType: (v) => typeof v === "string",
    image: (v) => typeof v === "string",
    completions: (v) => typeof v === "number",
  };

  // Validate field types
  for (const [key, validate] of Object.entries(validators)) {
    if (body[key] !== undefined && !validate(body[key])) {
      return NextResponse.json(
        { error: `${key} must be a ${typeof body[key]}` },
        { status: 400 },
      );
    }
  }

  try {
    const oldRef = dbRef(rtdb, `types/${oldType}`);
    const oldSnapshot = await get(oldRef);

    if (!oldSnapshot.exists()) {
      return NextResponse.json(
        { error: "Original type not found" },
        { status: 404 },
      );
    }

    const data = oldSnapshot.val();
    const previousImage: string | undefined = data.image;

    // Common helper to update image & delete old one if needed
    const updateImage = async (newImg?: string) => {
      if (!newImg) return;
      if (previousImage && previousImage !== newImg) {
        try {
          const oldImagePath = extractStoragePathFromUrl(previousImage);
          await deleteObject(storageRef(storage, oldImagePath));
        } catch (err) {
          console.warn("Failed to delete previous image:", err);
        }
      }
      data.image = newImg;
    };

    // Update completions if provided
    if (completions !== undefined) {
      data.completions = completions;
    }

    // Renaming
    if (newType && newType !== oldType) {
      const newRef = dbRef(rtdb, `types/${newType}`);
      const newSnapshot = await get(newRef);

      if (newSnapshot.exists()) {
        return NextResponse.json(
          { error: "A type with the new name already exists" },
          { status: 409 },
        );
      }

      await updateImage(image);
      await set(newRef, data);
      await remove(oldRef);

      return NextResponse.json({
        success: true,
        message: `Renamed ${oldType} to ${newType}`,
      });
    }

    // Just update same entry
    await updateImage(image);
    await set(oldRef, data);

    return NextResponse.json({
      success: true,
      message: `Updated type ${oldType}`,
    });
  } catch (err) {
    console.error("Error updating type:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ type: string }> },
) {
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
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// Utility to extract storage path from Firebase image URL
function extractStoragePathFromUrl(url: string): string {
  const match = decodeURIComponent(url).match(/\/o\/(.+?)\?alt=media/);
  if (!match || !match[1])
    throw new Error("Failed to extract image path from URL");
  return match[1]; // like "type-images/my-image.jpg"
}
