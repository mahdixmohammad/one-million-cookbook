"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarLinkProps = {
    name: string,
    href: string,
}

export default function SideBarLink({name, href}: SideBarLinkProps) {
    const pathname = usePathname();
    const active = (pathname === `/admin${href}`) ? true : false
    
    return (
        <Link href={"/admin" + href} className={`text-xl flex justify-center items-center gap-2 h-15 rounded-xl transition-all duration-200
        ${active ? "bg-gray-600 text-white" : "hover:bg-gray-200"}`}>
            <h3>{name}</h3>
            <div className="relative flex flex-col justify-between h-3">
                <div className={`w-[15px] h-1 rotate-45
                ${active ? "bg-white" : "bg-black"}`}></div>
                <div className={`w-[15px] h-1 rotate-135
                ${active ? "bg-white" : "bg-black"}`}></div>
            </div>
        </Link>
    )
}