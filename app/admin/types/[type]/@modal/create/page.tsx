"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import Image from "next/image";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoadingScreen from "@/components/LoadingScreen";

type Props = {
  params: Promise<{ type: string }>;
};

export default function CreateItemModal(props: Props) {
  let { type } = use(props.params);
  type = decodeURIComponent(type);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Item name is required.");
      return;
    }

    if (!file) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      const storage = getStorage(app);
      const fileRef = storageRef(storage, Date.now() + "-" + file.name);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);

      const payload: {
        name: string;
        image: string;
        ingredients: string;
        instructions: string;
      } = {
        name: trimmedName,
        image: imageUrl || "",
        ingredients: clean(ingredients).join("#"),
        instructions: clean(instructions).join("#"),
      };

      const res = await fetch(`/api/types/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed to create item");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-lg bg-white px-8 py-6 shadow-lg">
        <h2 className="mb-4 text-xl">إنشاء منتج جديد</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${name ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              اسم المنتج
            </span>
          </div>
          {/* Image Upload */}
          <label className="flex cursor-pointer items-center justify-between rounded border bg-gray-50 px-3 py-2 transition-all hover:bg-gray-100">
            <span className="text-gray-500">
              {file?.name || "اختار الصورة..."}
            </span>
            <span className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-300">
              تصفح
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                setPreview(selected ? URL.createObjectURL(selected) : null);
              }}
              className="hidden"
            />
          </label>

          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="h-auto max-h-48 w-full rounded border object-contain"
              width={50}
              height={50}
            />
          )}

          {/* Ingredients */}
          <div>
            <label className="font-medium">المكونات</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="relative mt-3 flex items-center gap-1">
                <input
                  type="text"
                  className="peer w-full rounded border px-3 py-2 focus:outline-none"
                  value={ing}
                  onChange={(e) => {
                    const updated = [...ingredients];
                    updated[idx] = e.target.value;
                    setIngredients(updated);
                  }}
                />
                <span
                  className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${ing ? "-translate-y-4 text-sm text-gray-700" : ""} `}
                >
                  {`مكون ${idx + 1}`}
                </span>
                <button
                  type="button"
                  className="cursor-pointer text-red-500"
                  onClick={() =>
                    setIngredients(ingredients.filter((_, i) => i !== idx))
                  }
                >
                  <TrashIcon className="w-5 text-red-600" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 flex cursor-pointer text-sm text-blue-600"
              onClick={() => setIngredients([...ingredients, ""])}
            >
              <PlusIcon className="w-5" /> إضافة مكون
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="font-medium">التعليمات</label>
            {instructions.map((ins, idx) => (
              <div key={idx} className="relative mt-3 flex items-center gap-1">
                <input
                  type="text"
                  className="peer w-full rounded border px-3 py-2 focus:outline-none"
                  value={ins}
                  onChange={(e) => {
                    const updated = [...instructions];
                    updated[idx] = e.target.value;
                    setInstructions(updated);
                  }}
                />
                <span
                  className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${ins ? "-translate-y-4 text-sm text-gray-700" : ""} `}
                >
                  {`خطوة ${idx + 1}`}
                </span>
                <button
                  type="button"
                  className="cursor-pointer text-red-500"
                  onClick={() =>
                    setInstructions(instructions.filter((_, i) => i !== idx))
                  }
                >
                  <TrashIcon className="w-5 text-red-600" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 flex cursor-pointer text-sm text-blue-600"
              onClick={() => setInstructions([...instructions, ""])}
            >
              <PlusIcon className="w-5" /> إضافة خطوة
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}`)}
              className="w-24 cursor-pointer rounded bg-gray-200 px-4 py-2 transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </button>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-green-700 px-4 py-2 text-white transition-all duration-150 hover:bg-green-800"
            >
              انشاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
