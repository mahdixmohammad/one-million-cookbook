import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get, set, remove } from "firebase/database";

export async function GET(_: Request, context: { params: Promise<{ type: string; }> }) {
  const { type } = await context.params;

  try {
    const dbRef = ref(rtdb, `types/${type}`);
    const snapshot = await get(dbRef);

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

// create item under this type
export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  const { type } = params;
  const body = await req.json();
  const { name, image, ingredients, instructions } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Missing or invalid item name" }, { status: 400 });
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }


  const itemRef = ref(rtdb, `types/${type}/items/${name}`);

  try {
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      return NextResponse.json({ error: "Item with this name already exists" }, { status: 400 });
    }

    await set(itemRef, {
      image: image || "",
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
    return NextResponse.json(
      { error: "newType must be a string" },
      { status: 400 }
    );
  }

  if (image && typeof image !== "string") {
    return NextResponse.json(
      { error: "image must be a string" },
      { status: 400 }
    );
  }

  try {
    const oldRef = ref(rtdb, `types/${oldType}`);

    // Check if the old type exists
    const oldSnapshot = await get(oldRef);
    if (!oldSnapshot.exists()) {
      return NextResponse.json({ error: "Original type not found" }, { status: 404 });
    }

    const data = oldSnapshot.val();

    // If renaming, check if newType already exists
    if (newType && newType !== oldType) {
      const newRef = ref(rtdb, `types/${newType}`);
      const newSnapshot = await get(newRef);
      if (newSnapshot.exists()) {
        return NextResponse.json(
          { error: "A type with the new name already exists" },
          { status: 409 }
        );
      }
      // Set new data path
      if (image) data.image = image;
      await set(newRef, data);
      await remove(oldRef);

      return NextResponse.json({ success: true, message: `Renamed ${oldType} to ${newType}` });
    } else {
      // Just update data in place
      if (image) data.image = image;
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
    const typeRef = ref(rtdb, `types/${type}`);

    // Check if type exists
    const snapshot = await get(typeRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    // Delete the type
    await remove(typeRef);

    return NextResponse.json({ success: true, message: `Type '${type}' has been deleted.` });
  } catch (err) {
    console.error("Error deleting type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
