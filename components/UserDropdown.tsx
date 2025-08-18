import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

type UserDropdownProps = {
  username: string;
};

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
    <div className="absolute top-13 left-4 flex flex-col items-center justify-center gap-3 rounded-md bg-white px-5 py-4 text-nowrap shadow drop-shadow">
      <div className="flex justify-center gap-3">
        <div className="flex flex-col">
          <p className="-mb-[5px] text-sm text-[rgb(50,50,50)]">مسجل الدخول:</p>
          <p className="text-left font-bold">{username}</p>
        </div>
        <Image
          className="mb-1 object-contain"
          src="/user-icon.png"
          alt=""
          width={35}
          height={35}
        ></Image>
      </div>
      <button
        onClick={handleClick}
        className="cursor-pointer rounded-md bg-red-800 px-5 py-1 whitespace-nowrap text-white hover:opacity-85"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}
