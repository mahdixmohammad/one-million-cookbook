import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get, set, update, remove } from "firebase/database";
import { authAdmin } from "@/lib/firebaseAdmin";

type Context = {
  params: Promise<{ uid: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  const { uid } = await context.params;

  try {
    const usersRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return NextResponse.json({}, { status: 404 });
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: Context) {
  const { uid } = await context.params;

  try {
    const { username, role, completions } = await request.json();

    const uidRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(uidRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: `User ${uid} does not exist.` },
        { status: 404 },
      );
    }

    const userData = snapshot.val();
    const updates: Record<string, any> = {};

    // 1. Username change (also updates email in Auth + DB + usernames mapping)
    if (username && username !== userData.username) {
      const newEmail = `${username}@futgulf.com`;
      const newUsernameRef = ref(rtdb, `usernames/${username}`);
      const usernameSnapshot = await get(newUsernameRef);

      if (usernameSnapshot.exists()) {
        return NextResponse.json(
          { error: "New username already exists." },
          { status: 409 },
        );
      }

      // Remove old username mapping
      const oldUsernameRef = ref(rtdb, `usernames/${userData.username}`);
      await remove(oldUsernameRef);

      // Set new username mapping with updated email
      await set(newUsernameRef, newEmail);

      // Update email in Firebase Auth
      await authAdmin.updateUser(uid, { email: newEmail });

      updates["username"] = username;
      updates["email"] = newEmail;
    }

    // 2. Role change
    if (role && role !== userData.role) {
      updates["role"] = role;
    }

    // 3. Completions change
    if (typeof completions === "number") {
      updates["completions"] = completions;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No valid updates provided." },
        { status: 400 },
      );
    }

    // Apply updates to Realtime Database
    await update(uidRef, updates);

    return NextResponse.json({
      success: true,
      message: `User ${uid} has been updated.`,
      updates,
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  const { uid } = await context.params;

  try {
    // 1. Get user data from DB (to remove username mapping later)
    const uidRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(uidRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: `User ${uid} does not exist.` },
        { status: 404 },
      );
    }

    const userData = snapshot.val();
    const { username } = userData;

    // 2. Delete from Firebase Auth
    await authAdmin.deleteUser(uid);

    // 3. Delete from Realtime Database
    await remove(uidRef);

    // 4. Delete username mapping
    if (username) {
      const usernameRef = ref(rtdb, `usernames/${username}`);
      await remove(usernameRef);
    }

    return NextResponse.json({
      success: true,
      message: `User ${uid} has been deleted.`,
    });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
