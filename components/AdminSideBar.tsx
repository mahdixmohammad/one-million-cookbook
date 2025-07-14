"use client"

import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function AdminSideBar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    return (
        <div className={`z-20 h-screen bg-white transition-all duration-300 ${sidebarOpen ? 'left-0 absolute md:relative' : 'absolute -left-[100vw] md:-left-[250px]'} w-screen  md:w-[250px] h-screen border-r-[1px] shadow-[0px_0px_5px_0.5px_rgba(0,0,0,0.15)] border-gray-300 text-black flex flex-col items-center`}>
            <div className="w-[100%] h-16 flex items-center justify-center">
                <Image src="/1M-logo-black.png" alt="" width={50} height={50}></Image>
            </div>
            {sidebarOpen &&
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 right-2 w-6 h-6 cursor-pointer flex flex-col justify-center items-center">
                <div className="absolute w-full h-[3px] bg-black rotate-45"></div>
                <div className="absolute w-full h-[3px] bg-black rotate-135"></div>
            </button>
            }
            <ul className="flex flex-col w-full mt-4">
                <li>
                    <SideBarLink name="Types" href="/types"/>
                </li>
            </ul>
        </div>
    )
}

type SideBarLinkProps = {
    name: string,
    href: string,
}
function SideBarLink({name, href}: SideBarLinkProps) {
    const pathname = usePathname();
    const active = (pathname === `/admin${href}`) ? true : false
    
    return (
        <Link href={"/admin" + href} className={`text-xl flex justify-center items-center gap-2 h-12 rounded-md transition-all duration-200
        ${active ? "bg-gold text-white" : "hover:bg-gray-200"}`}>
            <svg className="w-8 absolute left-15" fill="none" strokeWidth={1.5} stroke={active ? "white" : "black"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <h3>{name}</h3>
            <div className="absolute right-2 flex flex-col justify-between h-3">
                <div className={`w-[15px] h-1 rotate-45
                ${active ? "bg-white" : "bg-black"}`}></div>
                <div className={`w-[15px] h-1 rotate-135
                ${active ? "bg-white" : "bg-black"}`}></div>
            </div>
        </Link>
    )
}