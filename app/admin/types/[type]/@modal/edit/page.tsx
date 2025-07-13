"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

type Props = {
  params: Promise<{ type: string; }>;
};

export default function EditTypeModal(props: Props) {
  const { type } = use(props.params);

  const router = useRouter();
  const [name, setName] = useState(type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || name === type) {
    alert("Please enter a new name different from the current one.");
    return;
    }

    try {
        const response = await fetch(`/api/types/${type}/edit`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newType: name }),
        });

        const data = await response.json();

        if (!response.ok) {
        alert(data.error || "Failed to rename type");
        return;
        }

        router.push(`/admin/types/${name}`)

    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Edit Type Name</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Type name"
            required
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 cursor-pointer transition-all duration-150">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}