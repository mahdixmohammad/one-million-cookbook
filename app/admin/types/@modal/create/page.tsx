"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import Image from "next/image";

export default function EditTypeModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file) {
      alert("Please enter a type name and choose an image.");
      return;
    }

    try {
      const storage = getStorage(app);
      const fileRef = storageRef(storage, `${file.name}`);
      await uploadBytes(fileRef, file);
      const imageUrl = await getDownloadURL(fileRef);

      const response = await fetch(`/api/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: name, image: imageUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to create type");
        return;
      }

      router.push(`/admin/types`);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">إنشاء نوع</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              required
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${name ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              اسم النوع
            </span>
          </div>
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
              required
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/types`)}
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
