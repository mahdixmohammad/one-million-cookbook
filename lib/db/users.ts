import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export async function getUsername(uid: string) {
  const usernameRef = ref(rtdb, `/users/${uid}/username`);
  const snapshot = await get(usernameRef);
  return snapshot.val();
}
