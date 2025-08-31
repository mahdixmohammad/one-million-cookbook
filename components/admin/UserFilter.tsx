"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CustomSelect, { Option } from "../CustomSelect";

type Props = {
  roles: string[];
  filters: { role: string | null; active: string | null };
  setFilters: React.Dispatch<
    React.SetStateAction<{ role: string | null; active: string | null }>
  >;
  onFilter: (filters: { role: string | null; active: string | null }) => void;
};

export default function UserFilter({
  roles,
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
            <label className="block text-sm text-gray-500">الدور</label>
            <CustomSelect
              size="small"
              options={toOptions(roles)}
              value={
                filters.role
                  ? { value: filters.role, label: filters.role }
                  : null
              }
              onChange={(option) => handleChange("role", option)}
              placeholder="الكل"
              isRtl
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500">الحالة</label>
            <CustomSelect
              size="small"
              options={toOptions(["نشط", "غير نشط"])}
              value={
                filters.active
                  ? { value: filters.active, label: filters.active }
                  : null
              }
              onChange={(option) => handleChange("active", option)}
              placeholder="الكل"
              isRtl
            />
          </div>
        </div>
      )}
    </div>
  );
}
