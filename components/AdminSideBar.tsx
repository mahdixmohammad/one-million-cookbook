"use client"

import Image from "next/image"
import Link from "next/link";
import { useState } from "react"
import { usePathname } from "next/navigation";

export default function AdminSideBar() {
    const [isOpen, setIsOpen] = useState(true)
    const handleClick = () => setIsOpen((prev) => !prev)

    return (
        <div className={`transition-all duration-300 ${isOpen ? 'left-0 absolute md:relative' : 'absolute -left-[100vw] md:-left-[250px]'} w-screen  md:w-[250px] h-screen bg-gray-300 text-black flex flex-col items-center`}>
            <div className="w-[100%] h-16 flex items-center justify-center">
                <Image src="/1M-logo-black.png" alt="" width={50} height={50}></Image>
                <div className={`z-50 absolute rounded-full shadow cursor-pointer w-10 h-10 transition-all duration-300 ${isOpen ? 'right-2' : '-right-[55px]'}`}>
                    <svg onClick={handleClick}  fill="none" strokeWidth={1.5} stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
            </div>
            <ul className="flex flex-col w-full">
                <li>
                    <SideBarLink name="Types" href="/types"/>
                </li>
                <li>
                    <SideBarLink name="Items" href="/items"/>
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
        <Link href={"/admin" + href} className={`text-xl flex justify-center items-center gap-2 h-15 rounded-xl transition-all duration-200
        ${active ? "bg-gray-600 text-white" : "hover:bg-gray-200"}`}>
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