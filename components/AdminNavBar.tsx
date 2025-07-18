"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

type AdminNavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminNavBar({ sidebarOpen, setSidebarOpen }: AdminNavbarProps) {
  const [userDropdown, setUserDropDown] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const path = usePathname();
  const router = useRouter();

  const handleClick = () => {
    const splitPath = path.split("/");
    if (splitPath.length === 4) return router.push("/admin/types");
    if (splitPath.length === 5) {
      const type = splitPath[3];
      return router.push(`/admin/types/${type}`);
    }
  };

  const handleOpenDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setUserDropDown(true);
  };

  const handleCloseDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setUserDropDown(false);
    }, 100);
  };

  return (
    <div className="h-[64px] px-5 border-b bg-white border-gray-300 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full shadow border-2 border-gray-100 cursor-pointer p-[2px] w-10 h-10"
        >
          <svg fill="none" strokeWidth={1.5} stroke="black" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
        {path !== "/admin/types" && (
          <button
            onClick={handleClick}
            className="text-center w-22 rounded-2xl h-[34px] relative text-sm group cursor-pointer shadow border-2 border-gray-100 overflow-hidden"
            type="button"
          >
            <div className="bg-white shadow rounded-2xl h-[34px] w-8 flex items-center justify-center absolute left-[-1px] top-[0px] group-hover:w-22 z-10 duration-400">
              <svg className="rotate-180 w-[20px] h-[20px]" viewBox="0 0 1024 1024">
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                ></path>
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                ></path>
              </svg>
            </div>
            <p className="translate-x-2">العودة</p>
          </button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <svg
          className="w-8 h-8 cursor-pointer"
          fill="none"
          strokeWidth={1.5}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        <div
          onMouseEnter={handleOpenDropdown}
          onMouseLeave={handleCloseDropdown}
        >
        <svg className="w-8 h-8 cursor-pointer" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
          {userDropdown && (
            <div className="absolute left-0 -top-[2px] z-50" onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
