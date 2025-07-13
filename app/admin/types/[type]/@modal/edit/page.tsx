"use client";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";
import Image from "next/image";

type Props = {
  params: Promise<{ type: string }>;
};

export default function EditTypeModal(props: Props) {
  const { type } = use(props.params);

  const router = useRouter();

  const [name, setName] = useState(type);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);

  // Fetch current type data on mount
  useEffect(() => {
    async function fetchType() {
      try {
        const res = await fetch(`/api/types/${type}`);
        if (!res.ok) throw new Error("Failed to load type data");
        const data = await res.json();
        if (data.image) setInitialImage(data.image);
        setPreview(data.image || null);
      } catch (e) {
        console.error(e);
        setInitialImage(null);
        setPreview(null);
      }
    }
    fetchType();
  }, [type]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if something changed
    const isNameChanged = name !== type && name.trim() !== "";
    const isImageChanged = !!file;

    if (!isNameChanged && !isImageChanged) {
      alert("Please change the name or select a new image.");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (file) {
        const storage = getStorage(app);
        const fileRef = storageRef(storage, `${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      const payload: { newType?: string; image?: string } = {};
      if (isNameChanged) payload.newType = name;
      if (imageUrl) payload.image = imageUrl;

      const response = await fetch(`/api/types/${type}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update type");
        return;
      }

      router.push(`/admin/types/${isNameChanged ? name : type}`);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Edit Type</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Type name"
          />
          <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
            <span className="text-gray-500">{file?.name || "Choose image (optional)..."}</span>
            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
              Browse
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                setPreview(selected ? URL.createObjectURL(selected) : initialImage);
              }}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-48 object-contain rounded border"
              width={50}
              height={50}
            />
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}`)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 cursor-pointer transition-all duration-150"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
