import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export async function GET(_: Request, context: { params: Promise<{ type: string; item: string }> }) {
  const { type, item } = await context.params;

  try {
    const dbRef = ref(rtdb, `types/${type}/${item}`);
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
