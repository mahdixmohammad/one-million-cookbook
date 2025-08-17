import { NextRequest, NextResponse } from "next/server";
import { rtdb, storage } from "@/lib/firebase";
import { ref as dbRef, get, update, set, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

export async function GET(_: Request, context: { params: Promise<{ type: string; item: string }> }) {
  const { type, item } = await context.params;

  try {
    const itemRef = dbRef(rtdb, `types/${type}/items/${item}`);
    const snapshot = await get(itemRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const data = snapshot.val();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching item:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ type: string; item: string }> }
) {
  const { type, item } = await context.params;
  const itemRef = dbRef(rtdb, `types/${type}/items/${item}`);

  const deleteOldImage = async (oldUrl?: string, newUrl?: string) => {
    if (!oldUrl || !newUrl || oldUrl === newUrl) return;
    try {
      const oldImagePath = extractStoragePathFromUrl(oldUrl);
      await deleteObject(storageRef(storage, oldImagePath));
    } catch (err) {
      console.warn("Failed to delete old image:", err);
    }
  };

  try {
    const snapshot = await get(itemRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const existingData = snapshot.val();
    const previousImage: string | undefined = existingData?.image;

    const body = await req.json();
    const { newItem, image, ingredients, instructions, completions } = body;

    const updates: Record<string, any> = {};

    if (image) updates.image = image;
    if (ingredients !== undefined) updates.ingredients = ingredients;
    if (instructions !== undefined) updates.instructions = instructions;
    if (completions !== undefined) updates.completions = completions;

    // Rename item
    if (newItem && newItem !== item) {
      const newRef = dbRef(rtdb, `types/${type}/items/${newItem}`);

      await deleteOldImage(previousImage, image);
      await set(newRef, { ...existingData, ...updates });
      await remove(itemRef);

      return NextResponse.json({ message: "Item renamed and updated" });
    }

    // Update in place
    await deleteOldImage(previousImage, image);
    await update(itemRef, updates);

    return NextResponse.json({ message: "Item updated" });
  } catch (err) {
    console.error("Error updating item:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ type: string, item: string }> }) {
  const { type, item } = await context.params;
  const itemRef = dbRef(rtdb, `types/${type}/items/${item}`);

  try {
    const snapshot = await get(itemRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const itemData = snapshot.val();
    const imageUrl: string | undefined = itemData?.image;

    // Delete the image from Firebase Storage
    if (imageUrl) {
      try {
        const storagePath = extractStoragePathFromUrl(imageUrl);
        const imgRef = storageRef(storage, storagePath);
        await deleteObject(imgRef);
      } catch (error) {
        console.warn("Image deletion failed:", error);
      }
    }

    await remove(itemRef);
    return NextResponse.json({ message: "Item and its image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

// Utility function to extract Firebase Storage path from download URL
function extractStoragePathFromUrl(url: string): string {
  const match = decodeURIComponent(url).match(/\/o\/(.+?)\?alt=media/);
  if (!match || !match[1]) throw new Error("Failed to extract image path from URL");
  return match[1]; // like "item-images/some-image.jpg"
}
