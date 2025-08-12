"use client"

import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, get, onValue } from "firebase/database";
import { CheckIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import LoadingImage from "@/components/LoadingImage";

export default function Admin() {
    return (
        <div className="h-full grid grid-cols-1 sm:grid-cols-5 auto-rows-[350px] gap-4 p-2 xs:p-4">
            <ActiveUsersCard />
            <NumberOfCompletionsCard />
            <CompletionsCard />
        </div>
    )
}

const formatTime = (isoString: string) => {
    const date = new Date(isoString);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} @ ${hours}:${minutes}`;

}

function ActiveUsersCard() {
    const [users, setUsers] = useState<Array<any>>([])

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
        <div className="sm:col-span-3 col-span-1 bg-white w-full h-full shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg xs:px-3 py-3">
            <div className="flex gap-2 px-3 xs:px-0">
                <UsersIcon className="w-6" />
                <h3 className="font-bold text-lg">المستخدمون النشطون</h3>
            </div>
            <div className="overflow-auto max-h-[290px] mt-3 rounded-xl">
                <table className="w-full min-w-[300px] border-separate border-spacing-y-1">
                    <thead className="text-right text-gray-600 bg-white sticky z-10 top-0">
                        <tr>
                            <th className="pr-2 font-normal">الاسم</th>
                            <th className="font-normal">تاريخ تسجيل</th>
                            <th className="font-normal">الدور</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                        <tr key={i} className="bg-gray-100 h-11 hover:bg-gray-200 transition-all duration-150">
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

function NumberOfCompletionsCard() {
    const [todayCompletionsCount, setTodayCompletionsCount] = useState(0);

    useEffect(() => {
        const completionsRef = ref(rtdb, "/completions");

        const unsub = onValue(completionsRef, (snapshot) => {
            const completionsData = snapshot.val() || {};

            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today 00:00
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfToday.getDate() + 1); // tomorrow 00:00

            const todaysCompletions = Object.values(completionsData).filter((completion: any) => {
                const completionDate = new Date(completion.date);
                return completionDate >= startOfToday && completionDate < startOfTomorrow;
            });

            setTodayCompletionsCount(todaysCompletions.length);
        });

        return () => unsub();
    }, []);

    return (
        <div className="sm:col-span-2 col-span-1 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg p-3">
            <div className="flex gap-2">
                <CheckIcon className="w-6" />
                <h3 className="font-bold text-lg">إجمالي العمليات اليوم</h3>
            </div>
            <h3 className="overflow-auto w-full h-[70%] mt-3 rounded-xl flex justify-center items-center text-7xl text-black font-bold g-red-50">
                {todayCompletionsCount}
            </h3>
        </div>
    );
}

function CompletionsCard() {
  const [completions, setCompletions] = useState<
    { image: string; type: string; item: string; date: string; uid: string, username: string }[]
  >([]);

  const getUsername = async (uid: string) => {
    const usernameRef = ref(rtdb, `/users/${uid}/username`);
    const snapshot = await get(usernameRef);
    return snapshot.val();
  };

  const getImage = async (typeName: string, itemName: string) => {
    const imageRef = ref(rtdb, `/types/${typeName}/items/${itemName}/image`);
    const snapshot = await get(imageRef);
    return snapshot.val();
  };

  useEffect(() => {
    const completionsRef = ref(rtdb, "/completions");

    const unsub = onValue(completionsRef, async (snapshot) => {
      const completionsData = snapshot.val() || {};
      const completionsArray = Object.values(completionsData);

      const completionsWithImages = await Promise.all(
        completionsArray.map(async (completion: any) => {
          const image = await getImage(completion.type, completion.item);
          const username = await getUsername(completion.uid)
          return { ...completion, image, username };
        })
      );

      setCompletions(completionsWithImages);
    });

    return () => unsub();
  }, []);

  return (
    <div className="col-span-1 sm:col-span-5 bg-white shadow rounded-lg xs:px-3 py-3">
      <div className="flex gap-2 px-3 xs:px-0">
        <ClockIcon className="w-6" />
        <h3 className="font-bold text-lg">العمليات الأخيرة</h3>
      </div>
      <div className="overflow-auto max-h-[290px] mt-3 rounded-xl">
        <table className="w-full min-w-[400px] border-separate border-spacing-y-1">
          <thead className="text-right text-gray-600 bg-white sticky z-10 top-0">
            <tr>
              <th className="pr-2 font-normal">صورة</th>
              <th className="pr-2 font-normal">المنتج</th>
              <th className="font-normal">التاريخ</th>
              <th className="font-normal">المستخدم</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {completions.map((completion, i) => (
              <tr
                key={i}
                className="bg-gray-100 h-15 hover:bg-gray-200 transition-all duration-150"
              >
                <td className="rounded-r-lg pr-2">
                  {completion.image ? (
                    <LoadingImage
                      src={completion.image}
                      alt={completion.item}
                      position="start"
                      width={55}
                      height={55}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded" />
                  )}
                </td>
                <td>
                  <h3>{completion.item}</h3>
                </td>
                <td>
                  <h3>{formatTime(completion.date)}</h3>
                </td>
                <td className="rounded-l-lg">
                  <h3>{completion.username}</h3>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
