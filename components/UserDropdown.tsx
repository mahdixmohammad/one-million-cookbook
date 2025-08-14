import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

type UserDropdownProps = {
  username: string
}

export default function UserDropdown({ username }: UserDropdownProps) {
  const handleClick = async () => {
    if (!auth.currentUser) return;

    // Call logout API
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: auth.currentUser.uid }),
    });

    // Then sign out locally
    await signOut(auth);
  };

  return (
    <div className="px-5 py-4 text-nowrap bg-white shadow rounded-md drop-shadow absolute left-4 top-13 flex flex-col justify-center items-center gap-3">
      <div className="flex gap-3 justify-center">
        <div className="flex flex-col">
          <p className="text-sm -mb-[5px] text-[rgb(50,50,50)]">مسجل الدخول: 
          </p>
          <p className="font-bold text-left">
            {username}
          </p>
        </div>
        <Image className="object-contain mb-1" src="/user-icon.png" alt="" width={35} height={35}></Image>
      </div>
      <button
        onClick={handleClick}
        className="bg-red-800 text-white px-5 py-1 cursor-pointer rounded-md whitespace-nowrap hover:opacity-85"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}
