"use server";
import {
  CheckIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatISOTime } from "@/utils/format-time";
import Link from "next/link";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store",
  });

  const usersData = await res.json();
  const users: {
    active: boolean;
    completions: number;
    disconnected: boolean;
    email: string;
    lastLogin: string;
    role: string;
    username: string;
  }[] = Object.values(usersData);

  return (
    <section className="xs:px-3 rounded-lg bg-white py-3 shadow">
      <div className="xs:px-0 flex gap-2 px-3">
        <UserGroupIcon className="w-6" />
        <h3 className="text-lg font-bold">المستخدمين</h3>
        <Link
          href="/admin/users/create"
          className="flex h-7 w-21 items-center justify-center rounded-xl bg-green-700 text-sm text-white transition-all duration-150 hover:bg-green-800"
        >
          <PlusIcon className="w-5" />
          انشاء
        </Link>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[500px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
            <tr>
              <th className="pr-2 font-normal">الاسم</th>
              <th className="font-normal">الدور</th>
              <th className="font-normal">العمليات</th>
              <th className="font-normal">آخر تسجيل دخول</th>
              <th className="font-normal">نشط</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className="h-11 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2">{user.username}</td>
                <td>{user.role}</td>
                <td>{user.completions}</td>
                <td>
                  <div
                    dir="ltr"
                    className="flex h-13 flex-col items-end justify-center text-sm sm:flex-row sm:items-center sm:justify-end"
                  >
                    {formatISOTime(user.lastLogin)
                      .split(", ")
                      .map((part, i) => (
                        <span key={i}>
                          {part}
                          {i === 0 && part !== "مطلقًا" && ","}
                        </span>
                      ))}
                  </div>
                </td>
                <td>
                  {user.active ? (
                    <CheckIcon className="w-6 text-green-500" />
                  ) : (
                    <XMarkIcon className="w-6 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
