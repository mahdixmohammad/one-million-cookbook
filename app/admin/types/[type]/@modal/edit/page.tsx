"use client";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";

type Props = {
  params: Promise<{ type: string }>;
};

export default function EditTypeModal(props: Props) {
  let { type } = use(props.params);
  type = decodeURIComponent(type);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(type);
  const [initialCompletions, setInitialCompletions] = useState(0);
  const [completions, setCompletions] = useState(0);
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

        if (data.completions) {
          setInitialCompletions(data.completions);
          setCompletions(data.completions);
        }

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
    const isCompletionsChanged = completions !== initialCompletions;
    const isImageChanged = !!file;
    console.log(!isNameChanged && !isImageChanged && !isCompletionsChanged);

    if (!isNameChanged && !isImageChanged && !isCompletionsChanged) {
      alert(
        "Please change the name, select a new image or update completions.",
      );
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (file) {
        const storage = getStorage(app);
        const fileRef = storageRef(storage, `${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      const payload: {
        newType?: string;
        completions?: number;
        image?: string;
      } = {};
      if (isNameChanged) payload.newType = name;
      if (isCompletionsChanged) payload.completions = completions;
      if (imageUrl) payload.image = imageUrl;

      const res = await fetch(`/api/types/${type}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed to update type");
        return;
      }

      router.push(`/admin/types/${isNameChanged ? name : type}`);
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
        <h2 className="mb-4 text-xl">تحرير النوع</h2>
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
              اسم النوع
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={completions}
              onChange={(e) => setCompletions(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${completions !== undefined ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              العمليات
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
                setPreview(
                  selected ? URL.createObjectURL(selected) : initialImage,
                );
              }}
              className="hidden"
            />
          </label>

          {/* Preview */}
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
              onClick={() => router.push(`/admin/types/${type}`)}
              className="w-24 cursor-pointer rounded bg-gray-200 px-4 py-2 transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </button>
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
