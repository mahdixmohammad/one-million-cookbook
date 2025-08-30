import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
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

  type UserData = {
    active: boolean;
    completions: number;
    disconnected: boolean;
    email: string;
    lastLogin: string;
    role: string;
    username: string;
  };

  type UserTuple = [string, UserData];
  const users: UserTuple[] = Object.entries(usersData);

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
      <div className="mt-3 overflow-x-auto rounded-xl">
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
                <td className="rounded-r-lg pr-2">{user[1].username}</td>
                <td>{user[1].role}</td>
                <td>{user[1].completions}</td>
                <td>
                  <div
                    dir="ltr"
                    className="flex h-13 flex-col items-end justify-center text-sm sm:flex-row sm:items-center sm:justify-end"
                  >
                    {formatISOTime(user[1].lastLogin)
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
                  {user[1].active ? (
                    <CheckIcon className="w-6 text-green-500" />
                  ) : (
                    <XMarkIcon className="w-6 text-red-500" />
                  )}
                </td>
                <td className="rounded-l-xl pl-5">
                  <Link
                    href={`/admin/users/${user[0]}/edit`}
                    className="flex cursor-pointer items-center justify-end"
                  >
                    <PencilSquareIcon className="w-5 text-gray-600" />
                  </Link>
                </td>
                <td className="w-8 bg-white">
                  <Link
                    href={`/admin/users/${user[0]}/delete`}
                    className="flex cursor-pointer items-center justify-end"
                  >
                    <TrashIcon className="w-5 text-red-600" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
