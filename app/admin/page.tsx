"use client"

import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { UsersIcon } from "@heroicons/react/24/outline";

export default function Admin() {
    
    return (
        <div className="h-full grid grid-cols-1 sm:grid-cols-4 auto-rows-[350px] gap-4 p-4">
            <ActiveUsersCard />
            <div className="sm:col-span-2 col-span-1 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg p-3"></div>
            <div className="col-span-1 sm:col-span-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg p-3"></div>
        </div>
    )
}

function ActiveUsersCard() {
    const [users, setUsers] = useState<Array<any>>([])

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);

        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${month}/${day}/${year} @ ${hours}:${minutes}`;

    }

    useEffect(() => {
        const unsub = () => {
            const usersRef = ref(rtdb, "users");

            onValue(usersRef, (snapshot) => {
                const usersData = snapshot.val() || {};
                const filteredUsers = Object.values(usersData).filter(
                    (user: any) => user.active === true
                );

                filteredUsers.sort((a: any, b: any) => {
                    return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
                });

                setUsers(filteredUsers);
            });
        }

        return () => unsub();
    }, [])

    return (
        <div className="sm:col-span-2 col-span-1 bg-white w-full h-full shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg px-1 py-3">
            <div className="flex gap-2">
                <UsersIcon className="w-6" />
                <h3 className="font-bold text-lg">المستخدمون النشطون</h3>
            </div>
            <div className="overflow-auto max-h-[290px] mt-3 rounded-xl">
                <table className="w-full min-w-[300px] border-separate border-spacing-y-1">
                    <thead className="text-right text-gray-600 bg-white sticky top-0">
                        <tr>
                            <th className="pr-2 font-normal">الاسم</th>
                            <th className="font-normal">تاريخ تسجيل</th>
                            <th className="font-normal">الدور</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                        <tr key={i} className="bg-gray-100 h-12 hover:bg-gray-200 transition-all duration-150">
                            <td className="rounded-r-lg pr-2">
                                <h3>{user.username}</h3>
                            </td>
                            <td>
                                <h3>{formatTime(user.lastLogin)}</h3>
                            </td>
                            <td className="rounded-l-lg">
                                <h3>{user.role}</h3>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}