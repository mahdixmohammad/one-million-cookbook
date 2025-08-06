"use client"
import { useState, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NotificationButton() {
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
            <BellIcon className="w-8 cursor-pointer" />
            {dropdown && (
            <div onMouseEnter={handleOpenDropdown} onMouseLeave={handleCloseDropdown}>
                <NotificationDropdown />
            </div>
            )}
        </div>)
}
