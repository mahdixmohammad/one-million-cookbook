import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ref, update } from "firebase/database";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  const db = getDatabase();

  try {
    await update(ref(db, `users/${uid}`), {
      active: true,
      lastLogin: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
