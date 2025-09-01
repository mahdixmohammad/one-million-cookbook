"use client";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { BellIcon } from "@heroicons/react/24/outline";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function NotificationButton() {
  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  const [dropdown, setDropDown] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropDown(true);
  };

  const handleCloseDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropDown(false);
    }, 100);
  };

  useEffect(() => {
    const usersRef = ref(rtdb, "users");
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const count = Object.values(usersData).filter(
        (user: any) => user.active === true,
      ).length;
      setActiveUsersCount(count);
    });
  }, []);

  return (
    <div
      onMouseEnter={handleOpenDropdown}
      onMouseLeave={handleCloseDropdown}
      className="relative"
    >
      <BellIcon className="h-8 w-8 cursor-pointer" />
      {activeUsersCount > 0 && (
        <div className="absolute top-[1px] right-[2px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-700 text-center text-xs font-bold text-white">
          {activeUsersCount}
        </div>
      )}
      <div
        className={`absolute -top-2 left-0 z-50 mt-2 transition-all duration-200 ease-out ${
          dropdown
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <NotificationDropdown activeUsersCount={activeUsersCount} />
      </div>
    </div>
  );
}
