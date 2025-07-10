import { NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

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
