"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default function DeleteItemModal(props: Props) {
  let { type, item } = use(props.params);
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`/api/types/${type}/${item}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete item");
        return;
      }

      router.push(`/admin/types/${type}`);
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">حذف المنتج</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p>
            هل أنت متأكد أنك تريد حذف <strong>{item}</strong> من{" "}
            <strong>{type}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}/${item}`)}
              className="w-24 cursor-pointer rounded bg-gray-200 px-4 py-2 transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </button>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-red-800 px-4 py-2 text-white transition-all duration-150 hover:bg-red-900"
            >
              حذف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
