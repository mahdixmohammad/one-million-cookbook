"use client";

import { useState } from "react";
import Filter from "./Filter";
import Link from "next/link";
import LoadingImage from "../LoadingImage";
import { formatter } from "@/utils/format-time";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  completions: {
    date: string;
    item: string;
    quantity: number;
    type: string;
    uid: string;
    image: string;
    user: string;
  }[];
  types: string[];
  items: string[];
  users: string[];
};

export default function CompletionsTable({
  completions,
  types,
  items,
  users,
}: Props) {
  const [filters, setFilters] = useState<{
    type: string | null;
    item: string | null;
    user: string | null;
  }>({ type: null, item: null, user: null });

  const [filtered, setFiltered] = useState<
    {
      date: string;
      item: string;
      quantity: number;
      type: string;
      uid: string;
      image: string;
      user: string;
    }[]
  >(completions);

  const handleFilter = (filters: {
    type: string | null;
    item: string | null;
    user: string | null;
  }) => {
    setFilters(filters); // track applied filters

    let result = completions;
    if (filters.type) result = result.filter((c) => c.type === filters.type);
    if (filters.item) result = result.filter((c) => c.item === filters.item);
    if (filters.user) result = result.filter((c) => c.user === filters.user);
    setFiltered(result);
  };

  const removeFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: null };
    handleFilter(newFilters);
  };

  return (
    <section className="xs:px-3 max-h-[649px] rounded-lg bg-white py-3 shadow">
      <div className="flex gap-2 px-3">
        <h3 className="text-lg font-bold">العمليات</h3>
        <Filter
          types={types}
          items={items}
          users={users}
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilter}
        />
        {/* Active filters chips */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters)
            .filter(([, value]) => value)
            .map(([key, value]) => (
              <button
                key={key}
                onClick={() => removeFilter(key as keyof typeof filters)}
                className="flex cursor-pointer items-center rounded-xl bg-gray-200 px-2 py-1 text-sm transition hover:opacity-80"
              >
                {value}
                <XMarkIcon className="w-5 text-red-500" />
              </button>
            ))}
        </div>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
            <tr>
              <th className="pr-2 font-normal">الصورة</th>
              <th className="pr-2 font-normal">النوع</th>
              <th className="font-normal">المنتج</th>
              <th className="font-normal">الكمية</th>
              <th className="font-normal">التاريخ</th>
              <th className="font-normal">المستخدم</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((completion, i) => (
              <tr
                key={i}
                className="h-13 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2">
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                  >
                    <LoadingImage
                      src={completion.image}
                      alt={completion.item}
                      position="start"
                      width={50}
                      height={50}
                      className="rounded object-contain"
                      loadingSize="small"
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.type}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.item}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.quantity}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    dir="ltr"
                    className="flex h-13 flex-col items-end justify-end text-sm sm:flex-row sm:items-center"
                  >
                    {formatter
                      .format(new Date(completion.date))
                      .split(", ")
                      .map((part, i) => (
                        <span key={i}>
                          {part}
                          {i === 0 && ","}
                        </span>
                      ))}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.user}
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
