"use client";

import { useRouter, usePathname } from "next/navigation";
import UserButton from "./UserButton";
import NotificationButton from "./NotificationButton";
import HomeButton from "./HomeButton";
import { Bars3Icon } from "@heroicons/react/24/outline";

type AdminNavbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminNavBar({
  sidebarOpen,
  setSidebarOpen,
}: AdminNavbarProps) {
  const path = usePathname();
  const router = useRouter();

  const handleClick = () => {
    const splitPath = path.split("/");
    if (splitPath.length === 3) return router.push("/admin");
    if (splitPath.length === 4) return router.push("/admin/types");
    if (splitPath.length === 5) {
      const type = splitPath[3];
      return router.push(`/admin/types/${type}`);
    }
  };

  return (
    <div className="flex h-[64px] items-center justify-between border-gray-300 bg-white px-5 shadow-xs">
      <div className="flex items-center gap-2">
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 cursor-pointer rounded-full border-2 border-gray-100 p-[2px] shadow"
        >
          <Bars3Icon />
        </div>
        {path !== "/admin" && (
          <button
            onClick={handleClick}
            className="group relative h-[34px] w-22 cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-100 text-center text-sm shadow"
            type="button"
          >
            <div className="absolute top-[0px] left-[-1px] z-10 flex h-[34px] w-8 items-center justify-center rounded-2xl bg-white shadow duration-400 group-hover:w-22">
              <svg
                className="h-[20px] w-[20px] rotate-180"
                viewBox="0 0 1024 1024"
              >
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
      <div className="xs:gap-4 flex items-center gap-2">
        <NotificationButton />
        <UserButton />
        <HomeButton />
      </div>
    </div>
  );
}
