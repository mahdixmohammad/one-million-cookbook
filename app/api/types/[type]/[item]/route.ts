import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get, update, set, remove } from "firebase/database";

export async function GET(_: Request, context: { params: Promise<{ type: string; item: string }> }) {
  const { type, item } = await context.params;

  try {
    const dbRef = ref(rtdb, `types/${type}/items/${item}`);
    const snapshot = await get(dbRef);

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

export async function PATCH(req: NextRequest, { params }: { params: { type: string; item: string } }) {
  const { type, item } = params;
  const itemRef = ref(rtdb, `types/${type}/items/${item}`);

  try {
    const snapshot = await get(itemRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const body = await req.json();
    const { newItem, image, ingredients, instructions } = body;

    const updates: Record<string, any> = {};

    if (image) updates["image"] = image;
    if (ingredients !== undefined) updates["ingredients"] = ingredients;
    if (instructions !== undefined) updates["instructions"] = instructions;

    // If the name has changed, we must move data to a new key and delete the old
    if (newItem && newItem !== item) {
      const newRef = ref(rtdb, `types/${type}/items/${newItem}`);
      await set(newRef, { ...(snapshot.val()), ...updates });
      await remove(itemRef);
      return NextResponse.json({ message: "Item renamed and updated" });
    }

    // Otherwise, just update fields in-place
    await update(itemRef, updates);
    return NextResponse.json({ message: "Item updated" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
