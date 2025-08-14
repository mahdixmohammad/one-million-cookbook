"use client"
import { UserCircleIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";
import { useState, useEffect, useRef } from "react";
import { auth, rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export default function UserButton() {
  const [userDropdown, setUserDropDown] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState<string>("جارٍ التحميل...");

  const handleOpenDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setUserDropDown(true);
  };

  const handleCloseDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setUserDropDown(false);
    }, 100);
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchUsername = async () => {
      const usernameRef = ref(rtdb, `users/${auth.currentUser!.uid}/username`);
      const snapshot = await get(usernameRef);
      setUsername(snapshot.val());
    };

    fetchUsername();
  }, []);

  return (
    <div
      onMouseEnter={handleOpenDropdown}
      onMouseLeave={handleCloseDropdown}
      className="relative"
    >
      <UserCircleIcon className="w-8 cursor-pointer" />
      <div
        className={`absolute -left-3 -top-4 z-50 transition-all duration-200 ease-out ${
          userDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <UserDropdown username={username} />
      </div>
    </div>
  );
}
