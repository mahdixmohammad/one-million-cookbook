"use client"

import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, HomeIcon } from "@heroicons/react/24/outline";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminSideBar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    return (
        <div className={`z-20 h-screen bg-white transition-all duration-300 ${sidebarOpen ? 'right-0 absolute md:relative' : 'absolute -right-[100vw] md:-right-[250px]'} w-screen  md:w-[250px] h-screen border-r-[1px] shadow-[0px_0px_5px_0.5px_rgba(0,0,0,0.15)] border-gray-300 text-black flex flex-col items-center`}>
            <Link href="/admin" className="w-[100%] py-2 flex items-center justify-center">
                <Image src="/one-million-logo.jpg" alt="" width={150} height={50}></Image>
            </Link>
            {sidebarOpen &&
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 right-2 w-6 h-6 cursor-pointer flex flex-col justify-center items-center">
                <div className="absolute w-full h-[3px] bg-[rgb(50,50,50)] rotate-45"></div>
                <div className="absolute w-full h-[3px] bg-[rgb(50,50,50)] rotate-135"></div>
            </button>
            }
            <div className="w-full mt-4 flex flex-col gap-0">
                <SideBarLink name="القائمة الرئيسية" href="" icon={<HomeIcon />} setSidebarOpen={setSidebarOpen}/>
                <SideBarLink name="الأنواع" href="/types" icon={<BookOpenIcon />} setSidebarOpen={setSidebarOpen}/>
            </div>
        </div>
    )
}

type SideBarLinkProps = {
    name: string,
    href: string,
    icon: React.ReactNode,
    setSidebarOpen: (open: boolean) => void;
}

function SideBarLink({name, href, icon, setSidebarOpen}: SideBarLinkProps) {
    const pathname = usePathname();
    const active = (pathname === `/admin${href}`) ? true : false

    return (
        <Link onClick={() => setSidebarOpen(false)} href={"/admin" + href} className={`text-xl text-[rgb(50,50,50)] flex items-center gap-4 h-10 rounded-xl transition-all duration-200 pr-2 
        ${active ? "bg-[rgb(50,50,50)] text-white" : "hover:bg-gray-200"}`}>
            <div className="w-7">
                {icon}
            </div>
            <h3>{name}</h3>
            <div className="absolute left-2 flex flex-col justify-between h-3">
                <div className={`w-[15px] h-1 rotate-135
                ${active ? "bg-white" : "bg-[rgb(50,50,50)]"}`}></div>
                <div className={`w-[15px] h-1 rotate-45
                ${active ? "bg-white" : "bg-[rgb(50,50,50)]"}`}></div>
            </div>
        </Link>
    )
}