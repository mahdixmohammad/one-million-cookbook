"use client"
import { useState, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationIcon() {
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

    return (
        <div
            onMouseEnter={handleOpenDropdown}
            onMouseLeave={handleCloseDropdown}
            className="relative"
        >
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
            {dropdown && (
            <div onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                <NotificationDropdown />
            </div>
            )}
        </div>)
}
