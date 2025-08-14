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
        (user: any) => user.active === true
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
      <BellIcon className="w-8 h-8 cursor-pointer" />
      {activeUsersCount > 0 && (
        <div className="absolute top-[1px] right-[2px] font-bold text-xs flex justify-center items-center text-center bg-red-700 text-white w-[14px] h-[14px] rounded-full">
          {activeUsersCount}
        </div>
      )}
      <div
        className={`absolute left-0 -top-2 mt-2 z-50 transition-all duration-200 ease-out ${
          dropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <NotificationDropdown activeUsersCount={activeUsersCount} />
      </div>
    </div>
  );
}
