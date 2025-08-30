import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";

export async function getUsername(uid: string) {
  const usernameRef = ref(rtdb, `/users/${uid}/username`);
  const snapshot = await get(usernameRef);
  if (!snapshot.exists()) return "غير متوفر";
  return snapshot.val();
}

// Use only on client side components
export async function customSignOut(auth: any) {
  // Call logout API
  await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid: auth.currentUser.uid }),
  });

  // Then sign out locally
  await signOut(auth);
}
