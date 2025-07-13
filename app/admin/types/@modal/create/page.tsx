"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Create Type</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Type name"
            required
          />
          <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
            <span className="text-gray-500">{file?.name || "Choose image..."}</span>
            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
              Browse
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={e => {const selected = e.target.files?.[0] || null; setFile(selected); setPreview(selected ? URL.createObjectURL(selected) : null);}}
              className="hidden"
              required
            />
          </label>
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-48 object-contain rounded border"
              width={50} height={50}
            />
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => router.push(`/admin/types`)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer transition-all duration-150">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
