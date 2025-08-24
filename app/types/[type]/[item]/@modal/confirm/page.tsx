"use client";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import { getAuth } from "firebase/auth";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default function ConfirmCompletionModal(props: Props) {
  let { type, item } = use(props.params);
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const uid = auth.currentUser!.uid;

      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, item, uid, quantity }),
      });

      if (!res.ok) throw new Error("Failed to complete");

      const data = await res.json();

      router.push(`/completions/${data.completionId}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
        <Loading />
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">تأكيد العملية</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder=" "
              min={1}
              required
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${quantity ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              الكمية
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <Link
              href={`/types/${type}/${item}`}
              className="w-24 rounded bg-gray-200 px-4 py-2 text-center transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </Link>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-green-700 px-4 py-2 text-white transition-all duration-150 hover:bg-green-800"
            >
              تأكيد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
