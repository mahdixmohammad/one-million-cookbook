"use client";

import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { CheckIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import LoadingImage from "@/components/LoadingImage";
import { getUsername } from "@/lib/db/users";
import { getImage } from "@/lib/db/items";
import { formatter } from "@/utils/format-time";

export default function Admin() {
  return (
    <div className="xs:p-4 grid h-full auto-rows-[350px] grid-cols-1 gap-4 p-2 sm:grid-cols-5">
      <ActiveUsersCard />
      <NumberOfCompletionsCard />
      <CompletionsCard />
    </div>
  );
}

function ActiveUsersCard() {
  const [users, setUsers] = useState<Array<any>>([]);

  useEffect(() => {
    const usersRef = ref(rtdb, "users");

    const unsub = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      const filteredUsers = Object.values(usersData).filter(
        (user: any) => user.active === true,
      );

      filteredUsers.sort((a: any, b: any) => {
        return (
          new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
        );
      });

      setUsers(filteredUsers);
    });

    return () => unsub();
  }, []);

  return (
    <div className="xs:px-3 col-span-1 h-full w-full rounded-lg bg-white py-3 shadow sm:col-span-3">
      <div className="xs:px-0 flex gap-2 px-3">
        <UsersIcon className="w-6" />
        <h3 className="text-lg font-bold">المستخدمون النشطون</h3>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[300px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
            <tr>
              <th className="pr-2 font-normal">الاسم</th>
              <th className="font-normal">تاريخ تسجيل</th>
              <th className="font-normal">الدور</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className="h-11 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2">
                  <h3>{user.username}</h3>
                </td>
                <td>
                  <h3 dir="ltr" className="flex justify-end">
                    {formatter.format(new Date(user.lastLogin))}
                  </h3>
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
  );
}

function NumberOfCompletionsCard() {
  const [todayCompletionsCount, setTodayCompletionsCount] = useState(0);

  useEffect(() => {
    const completionsRef = ref(rtdb, "/completions");

    const unsub = onValue(completionsRef, (snapshot) => {
      const completionsData = snapshot.val() || {};

      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ); // today 00:00
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfToday.getDate() + 1); // tomorrow 00:00

      const todaysCompletions = Object.values(completionsData).filter(
        (completion: any) => {
          const completionDate = new Date(completion.date);
          return (
            completionDate >= startOfToday && completionDate < startOfTomorrow
          );
        },
      );

      setTodayCompletionsCount(todaysCompletions.length);
    });

    return () => unsub();
  }, []);

  return (
    <div className="col-span-1 rounded-lg bg-white p-3 shadow sm:col-span-2">
      <div className="flex gap-2">
        <CheckIcon className="w-6" />
        <h3 className="text-lg font-bold">إجمالي العمليات اليوم</h3>
      </div>
      <h3 className="g-red-50 mt-3 flex h-[70%] w-full items-center justify-center overflow-auto rounded-xl text-7xl font-bold text-black">
        {todayCompletionsCount}
      </h3>
    </div>
  );
}

function CompletionsCard() {
  const [completions, setCompletions] = useState<
    {
      image: string;
      type: string;
      item: string;
      date: string;
      uid: string;
      username: string;
    }[]
  >([]);

  useEffect(() => {
    const completionsRef = ref(rtdb, "/completions");

    const unsub = onValue(completionsRef, async (snapshot) => {
      const completionsData = snapshot.val() || {};
      const completionsArray = Object.values(completionsData);

      const completionsWithImages = await Promise.all(
        completionsArray.map(async (completion: any) => {
          const image = await getImage(completion.type, completion.item);
          const username = await getUsername(completion.uid);
          return { ...completion, image, username };
        }),
      );

      completionsWithImages.reverse();

      setCompletions(completionsWithImages);
    });

    return () => unsub();
  }, []);

  return (
    <div className="xs:px-3 col-span-1 rounded-lg bg-white py-3 shadow sm:col-span-5">
      <div className="xs:px-0 flex gap-2 px-3">
        <ClockIcon className="w-6" />
        <h3 className="text-lg font-bold">العمليات الأخيرة</h3>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[400px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
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
                className="h-15 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2">
                  {completion.image ? (
                    <LoadingImage
                      src={completion.image}
                      alt={completion.item}
                      position="start"
                      width={55}
                      height={55}
                      className="rounded object-contain"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-300" />
                  )}
                </td>
                <td>
                  <h3>{completion.item}</h3>
                </td>
                <td>
                  <h3 dir="ltr" className="flex justify-end">
                    {formatter.format(new Date(completion.date))}
                  </h3>
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
