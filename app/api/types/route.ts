import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const typesRef = ref(rtdb, "types");
    const snapshot = await get(typesRef);

    if (!snapshot.exists()) {
      return NextResponse.json([], { status: 200 });
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch from RTDB:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
