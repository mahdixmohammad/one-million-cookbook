"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import CustomSelect, { Option } from "@/components/CustomSelect";

export default function ConfirmCompletionModal() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert("Please choose a role for the user");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: role.value }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed to create user");
        return;
      }

      router.push(`/admin/users`);
    } catch (e: any) {
      setLoading(false);
      alert(e.message);
    }
  };

  const roleOptions: Option[] = [
    { value: "مسؤل", label: "مسؤل" },
    { value: "موظف", label: "موظف" },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">إنشاء مستخدم</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${username ? "-translate-y-4 text-sm text-gray-700" : ""}`}
            >
              الاسم
            </span>
          </div>

          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${password ? "-translate-y-4 text-sm text-gray-700" : ""}`}
            >
              كلمة المرور
            </span>
          </div>
          <CustomSelect
            size="medium"
            options={roleOptions}
            value={role}
            onChange={setRole}
            placeholder="اختار الدور"
          />
          <div className="flex justify-end gap-2">
            <Link
              href={`/admin/users`}
              className="w-24 rounded bg-gray-200 px-4 py-2 text-center transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </Link>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-green-700 px-4 py-2 text-white transition-all duration-150 hover:bg-green-800"
            >
              إنشاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
