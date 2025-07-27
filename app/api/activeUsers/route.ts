import { rtdb } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const activeUsersRef = ref(rtdb, "activeUsers");
    const snapshot = await get(activeUsersRef);

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

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    const activeUsersRef = ref(rtdb, "activeUsers");
    const snapshot = await get(activeUsersRef);
    const current = snapshot.exists() ? snapshot.val() : "";

    const updated = current.includes(uid) ? current : current + uid + " ";

    await set(activeUsersRef, updated);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding user to activeUsers:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
