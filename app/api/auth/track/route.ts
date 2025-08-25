import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, update } from "firebase/database";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  try {
    const userRef = ref(rtdb, `users/${uid}`);
    await update(userRef, {
      disconnected: false,
      active: true,
      lastLogin: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
