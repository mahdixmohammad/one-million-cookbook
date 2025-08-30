"use client";

import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import CustomSelect, { Option } from "@/components/CustomSelect";

type Props = {
  params: Promise<{ uid: string }>;
};

export default function EditUserModal(props: Props) {
  let { uid } = use(props.params);
  uid = decodeURIComponent(uid);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [initalUsername, setInitialUsername] = useState("");
  const [role, setRole] = useState<Option | null>(null);
  const [initialrole, setInitialRole] = useState<Option | null>(null);
  const [initialCompletions, setInitialCompletions] = useState(0);
  const [completions, setCompletions] = useState(0);

  const roleOptions: Option[] = [
    { value: "مسؤل", label: "مسؤل" },
    { value: "موظف", label: "موظف" },
  ];

  // Fetch current user data on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${uid}`);
        if (!res.ok) throw new Error("Failed to load user data");
        const data = await res.json();

        setUsername(data.username);
        setInitialUsername(data.username);
        setRole({ value: data.role, label: data.role });
        setInitialRole({ value: data.role, label: data.role });
        setInitialCompletions(data.completions);
        setCompletions(data.completions);
      } catch (e) {
        console.error(e);
      }
    }
    fetchUser();
  }, [uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // check changes
    const isUsernameChanged =
      username !== initalUsername && username.trim() !== "";
    const isRoleChanged = role?.value !== initialrole?.value;
    const isCompletionsChanged = completions !== initialCompletions;

    if (!isUsernameChanged && !isRoleChanged && !isCompletionsChanged) {
      alert("Please change at least one field.");
      return;
    }

    setLoading(true);

    try {
      const payload: {
        username?: string;
        role?: string;
        completions?: number;
      } = {};

      if (isUsernameChanged) payload.username = username;
      if (isRoleChanged) payload.role = role!.value;
      if (isCompletionsChanged) payload.completions = completions;

      const res = await fetch(`/api/users/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed to update user");
        return;
      }

      router.push("/admin/users");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">تحرير المستخدم</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${
                username ? "-translate-y-4 text-sm text-gray-700" : ""
              }`}
            >
              اسم المستخدم
            </span>
          </div>
          {/* Role */}
          <CustomSelect
            size="medium"
            options={roleOptions}
            value={role}
            onChange={setRole}
            placeholder="اختار الدور"
          />
          {/* Completions */}
          <div className="relative">
            <input
              type="number"
              min={0}
              value={completions}
              onChange={(e) => setCompletions(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 ${
                completions !== undefined
                  ? "-translate-y-4 text-sm text-gray-700"
                  : ""
              }`}
            >
              العمليات
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Link
              href="/admin/users"
              className="w-24 cursor-pointer rounded bg-gray-200 px-4 py-2 text-center transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </Link>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-gray-600 px-4 py-2 text-white transition-all duration-150 hover:bg-gray-700"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
