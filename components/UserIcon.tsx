"use client"
import { UserCircleIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./UserDropdown";
import { useState, useRef } from "react";

export default function UserIcon() {
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
        <div
            onMouseEnter={handleOpenDropdown}
            onMouseLeave={handleCloseDropdown}
            className="relative"
        >
            <UserCircleIcon className="w-8 cursor-pointer" />
            {userDropdown && (
            <div className="absolute -left-3 -top-4 z-50" onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                <UserDropdown />
            </div>
            )}
        </div>)
}