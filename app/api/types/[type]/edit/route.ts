import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get, set, remove } from "firebase/database";

export async function PATCH(request: Request, context: { params: Promise<{ type: string }> }) {
  const { type: oldType } = await context.params;
  const body = await request.json();
  const { newType } = body;

  if (!newType || typeof newType !== "string") {
    return NextResponse.json({ error: "New type name is required and must be a string" }, { status: 400 });
  }

  if (newType === oldType) {
    return NextResponse.json({ error: "New type name must be different from the current type name" }, { status: 400 });
  }

  try {
    const oldRef = ref(rtdb, `types/${oldType}`);
    const newRef = ref(rtdb, `types/${newType}`);

    // Check if the old type exists
    const oldSnapshot = await get(oldRef);
    if (!oldSnapshot.exists()) {
      return NextResponse.json({ error: "Original type not found" }, { status: 404 });
    }

    // Prevent overwriting existing new type
    const newSnapshot = await get(newRef);
    if (newSnapshot.exists()) {
      return NextResponse.json({ error: "A type with the new name already exists" }, { status: 409 });
    }

    // Copy old type to new type and delete the old one
    const data = oldSnapshot.val();
    await set(newRef, data);
    await remove(oldRef);

    return NextResponse.json({ success: true, message: `Renamed ${oldType} to ${newType}` });
  } catch (err) {
    console.error("Error renaming type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}