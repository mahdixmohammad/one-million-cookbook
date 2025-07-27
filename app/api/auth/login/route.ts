import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    // Treat as username and look it up
    const usernameRef = ref(rtdb, `usernames/${identifier}`);
    const usernameSnap = await get(usernameRef);

    if (!usernameSnap.exists()) {
        return NextResponse.json({ error: "Username not found" }, { status: 404 });
    }

    const email = usernameSnap.val();
    if (!email) {
        return NextResponse.json({ error: "Email is missing from database" }, { status: 500 });
    }

    return NextResponse.json({ email });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
