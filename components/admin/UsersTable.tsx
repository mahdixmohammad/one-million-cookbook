"use client";

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
import { useState } from "react";
import UserFilter from "./UserFilter";

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

type Props = {
  users: UserTuple[];
};

export default function UsersTable({ users }: Props) {
  const [filters, setFilters] = useState<{
    role: string | null;
    active: string | null;
  }>({ role: null, active: null });

  const [filtered, setFiltered] = useState<UserTuple[]>(users);

  const handleFilter = (newFilters: {
    role: string | null;
    active: string | null;
  }) => {
    setFilters(newFilters);

    let result = users;
    if (newFilters.role)
      result = result.filter(([, u]) => u.role === newFilters.role);
    if (newFilters.active) {
      const isActive = newFilters.active === "نشط";
      result = result.filter(([, u]) => u.active === isActive);
    }
    setFiltered(result);
  };

  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: null };
    handleFilter(newFilters);
  };

  return (
    <section className="xs:px-3 rounded-lg bg-white py-3 shadow">
      <div className="flex flex-wrap gap-2 px-3">
        <UserGroupIcon className="w-6" />
        <h3 className="text-lg font-bold">المستخدمين</h3>
        <Link
          href="/admin/users/create"
          className="flex h-7 w-21 items-center justify-center rounded-xl bg-green-700 text-sm text-white transition-all duration-150 hover:bg-green-800"
        >
          <PlusIcon className="w-5" />
          انشاء
        </Link>
        <UserFilter
          roles={[...new Set(users.map(([, u]) => u.role))]}
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilter}
        />
        {/* Active filters chips */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters)
            .filter(([, v]) => v)
            .map(([key, value]) => (
              <button
                key={key}
                onClick={() => removeFilter(key as keyof typeof filters)}
                className="flex cursor-pointer items-center gap-1 rounded-xl bg-gray-200 px-2 py-1 text-sm transition hover:opacity-80"
              >
                {value}
                <XMarkIcon className="w-4 text-red-500" />
              </button>
            ))}
        </div>
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
            {filtered.map(([id, user], i) => (
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
                <td className="rounded-l-xl pl-5">
                  <Link
                    href={`/admin/users/${id}/edit`}
                    className="flex cursor-pointer items-center justify-end"
                  >
                    <PencilSquareIcon className="w-5 text-gray-600" />
                  </Link>
                </td>
                <td className="w-8 bg-white">
                  <Link
                    href={`/admin/users/${id}/delete`}
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
      <div className="px-3">{filtered.length} نتائج</div>
    </section>
  );
}
