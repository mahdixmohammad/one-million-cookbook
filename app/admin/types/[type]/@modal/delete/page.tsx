"use client";
import { useRouter } from "next/navigation";
import { use } from "react";

type Props = {
  params: Promise<{ type: string; }>;
};

export default function EditTypeModal(props: Props) {
  const { type } = use(props.params);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const response = await fetch(`/api/types/${type}/delete`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to delete type");
      return;
    }

    router.push(`/admin/types/`)

    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Delete Type</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p>Are you sure you want to delete this type? This will delete all of its items as well.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-red-800 text-white hover:bg-red-900 cursor-pointer transition-all duration-150">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}