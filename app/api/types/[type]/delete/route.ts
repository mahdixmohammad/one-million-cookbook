import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get, remove } from "firebase/database";

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
