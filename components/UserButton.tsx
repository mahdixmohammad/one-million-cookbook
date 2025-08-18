"use client";
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
        className={`absolute -top-4 -left-3 z-50 transition-all duration-200 ease-out ${
          userDropdown
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <UserDropdown username={username} />
      </div>
    </div>
  );
}
