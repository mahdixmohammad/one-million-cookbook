import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function UserDropdown() {
  const handleClick = async () => {
    if (!auth.currentUser) return;

    // Call logout API to set active = false
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: auth.currentUser.uid }),
    });

    // Then sign out the user locally
    await signOut(auth);
  };

  return (
    <div className="px-3 py-3 bg-white drop-shadow-md border-2 border-gray-100 absolute left-4 top-13 flex justify-center items-center">
      <button
        onClick={handleClick}
        className="bg-red-800 text-white px-5 py-1 cursor-pointer rounded-md whitespace-nowrap"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}
