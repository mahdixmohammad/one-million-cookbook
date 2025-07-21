"use client";
import { useRouter } from "next/navigation";
import { use } from "react";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default function DeleteItemModal(props: Props) {
  let { type, item } = use(props.params);
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/types/${type}/${item}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete item");
        return;
      }

      router.push(`/admin/types/${type}`);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">حذف المنتج</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p>هل أنت متأكد أنك تريد حذف <strong>{item}</strong> من <strong>{type}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}/${item}`)}
              className="px-4 py-2 w-24 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150"
            >
              الغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 w-24 rounded bg-red-800 text-white hover:bg-red-900 cursor-pointer transition-all duration-150"
            >
              حذف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
