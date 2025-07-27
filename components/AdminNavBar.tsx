"use client";

import { useRouter, usePathname } from "next/navigation";
import UserIcon from "./UserIcon";
import NotificationIcon from "./NotificationIcon";

type AdminNavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminNavBar({ sidebarOpen, setSidebarOpen }: AdminNavbarProps) {
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
        <NotificationIcon />
        <UserIcon />
      </div>
    </div>
  );
}
