import { rtdb } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import { authAdmin } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const usersRef = ref(rtdb, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch from RTDB:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: "Missing username, password, or role" },
        { status: 400 },
      );
    }

    const usernameRef = ref(rtdb, `usernames/${username}`);
    const usernameSnapshot = await get(usernameRef);
    if (usernameSnapshot.exists()) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 },
      );
    }

    const email = `${username}@futgulf.com`;
    await set(usernameRef, email);

    const userRecord = await authAdmin.createUser({
      email,
      password,
    });

    const userIdRef = ref(rtdb, `users/${userRecord.uid}`);
    const userIdSnapshot = await get(userIdRef);
    if (userIdSnapshot.exists()) {
      return NextResponse.json(
        { error: "User ID already exists" },
        { status: 409 },
      );
    }

    await set(userIdRef, {
      active: false,
      completions: 0,
      disconnected: false,
      email,
      lastLogin: "2025-01-01T00:00:00.000Z",
      role,
      username,
    });

    return NextResponse.json({ user: userRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
