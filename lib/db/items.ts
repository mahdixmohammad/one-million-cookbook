import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export async function getImage(typeName: string, itemName: string) {
  const imageRef = ref(rtdb, `/types/${typeName}/items/${itemName}/image`);
  const snapshot = await get(imageRef);
  if (!snapshot.exists()) return "/error-icon.png";
  return snapshot.val();
}
