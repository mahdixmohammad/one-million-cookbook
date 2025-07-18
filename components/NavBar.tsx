"use client";

import { useState, useRef } from "react";
import UserDropdown from "./UserDropdown";

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
    const [userDropdown, setUserDropDown] = useState(false);
    const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

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
        <nav className="h-16 w-screen px-10 py-10 flex items-center justify-between">
            <Link href="/types">
                <Image src="/1M-logo.png" width={60} height={60} alt="" />
            </Link>
            <div
                onMouseEnter={handleOpenDropdown}
                onMouseLeave={handleCloseDropdown}
                className="relative"
            >
                <svg className="w-8 h-8 cursor-pointer" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                    {userDropdown && (
                    <div className="absolute -left-5 -top-[15px] z-50" onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                        <UserDropdown />
                    </div>
                    )}
            </div>
        </nav>
    )
}