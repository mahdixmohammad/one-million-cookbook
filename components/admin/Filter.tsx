"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CustomSelect, { Option } from "../CustomSelect";

type Props = {
  types: string[];
  items: string[];
  users: string[];
  filters: any;
  setFilters: any;
  onFilter: (filters: {
    type: string | null;
    item: string | null;
    user: string | null;
  }) => void;
};

export default function Filter({
  types,
  items,
  users,
  filters,
  setFilters,
  onFilter,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleChange = (key: keyof typeof filters, option: Option | null) => {
    const value = option ? option.value : null;
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const toOptions = (arr: string[]): Option[] =>
    arr.map((v) => ({ value: v, label: v }));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 cursor-pointer items-center gap-1 rounded-xl bg-gray-400 px-2 text-sm text-white transition-all duration-150 hover:bg-gray-500"
      >
        <FunnelIcon className="w-4" />
        التصفيات
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl bg-white p-3 shadow drop-shadow">
          <div className="mb-2">
            <label className="block text-sm text-gray-500">النوع</label>
            <CustomSelect
              options={toOptions(types)}
              value={
                filters.type
                  ? { value: filters.type, label: filters.type }
                  : null
              }
              onChange={(option) => handleChange("type", option)}
              placeholder="الكل"
              isRtl
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-500">المنتج</label>
            <CustomSelect
              options={toOptions(items)}
              value={
                filters.item
                  ? { value: filters.item, label: filters.item }
                  : null
              }
              onChange={(option) => handleChange("item", option)}
              placeholder="الكل"
              isRtl
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500">المستخدم</label>
            <CustomSelect
              options={toOptions(users)}
              value={
                filters.user
                  ? { value: filters.user, label: filters.user }
                  : null
              }
              onChange={(option) => handleChange("user", option)}
              placeholder="الكل"
              isRtl
            />
          </div>
        </div>
      )}
    </div>
  );
}
