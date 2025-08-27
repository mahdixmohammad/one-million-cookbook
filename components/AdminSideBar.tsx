"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminSideBar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 block bg-black/20 backdrop-blur-xs lg:hidden"
        />
      )}
      <div
        className={`z-30 h-screen bg-white shadow-sm transition-all duration-300 ${sidebarOpen ? "absolute right-0 lg:relative" : "xs:-right-[250px] absolute -right-[100vw]"} xs:w-[250px] flex h-screen w-screen flex-col items-center border-gray-200 text-black`}
      >
        <Link
          href="/admin"
          className="flex w-[100%] items-center justify-center py-2"
        >
          <Image
            src="/one-million-logo.jpg"
            alt=""
            width={150}
            height={50}
          ></Image>
        </Link>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 right-2 flex h-6 w-6 cursor-pointer flex-col items-center justify-center"
          >
            <div className="absolute h-[3px] w-full rotate-45 bg-[rgb(50,50,50)]"></div>
            <div className="absolute h-[3px] w-full rotate-135 bg-[rgb(50,50,50)]"></div>
          </button>
        )}
        <div className="mt-4 flex w-full flex-col gap-0">
          <p className="mr-4 mb-0.5 text-black opacity-60">روابط التنقل</p>
          <SideBarLink
            name="القائمة الرئيسية"
            href=""
            icon={<HomeIcon />}
            setSidebarOpen={setSidebarOpen}
          />
          <SideBarLink
            name="الأنواع"
            href="/types"
            icon={<BookOpenIcon />}
            setSidebarOpen={setSidebarOpen}
          />
          <SideBarLink
            name="العمليات"
            href="/completions"
            icon={<CalendarDaysIcon />}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </>
  );
}

type SideBarLinkProps = {
  name: string;
  href: string;
  icon: React.ReactNode;
  setSidebarOpen: (open: boolean) => void;
};

function SideBarLink({ name, href, icon, setSidebarOpen }: SideBarLinkProps) {
  const pathname = usePathname();
  const active = pathname === `/admin${href}` ? true : false;

  return (
    <Link
      onClick={() => setSidebarOpen(false)}
      href={"/admin" + href}
      className={`flex h-10 items-center gap-4 rounded-xl pr-2 text-xl text-[rgb(50,50,50)] transition-all duration-200 ${active ? "bg-[rgb(50,50,50)] text-white" : "hover:bg-gray-100"}`}
    >
      <div className="w-7">{icon}</div>
      <h3>{name}</h3>
      <div className="absolute left-2 flex h-3 flex-col justify-between">
        <div
          className={`h-1 w-[15px] rotate-135 ${active ? "bg-white" : "bg-[rgb(50,50,50)]"}`}
        ></div>
        <div
          className={`h-1 w-[15px] rotate-45 ${active ? "bg-white" : "bg-[rgb(50,50,50)]"}`}
        ></div>
      </div>
    </Link>
  );
}
