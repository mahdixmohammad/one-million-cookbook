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

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default function EditItemModal(props: Props) {
  let { type, item } = use(props.params);
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const router = useRouter();

  const [name, setName] = useState(item);
  const [initialCompletions, setInitialCompletions] = useState(0);
  const [completions, setCompletions] = useState(0);
  const [originalIngredients, setOriginalIngredients] = useState<string[]>([]);
  const [originalInstructions, setOriginalInstructions] = useState<string[]>(
    [],
  );
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/types/${type}/${item}`);
        if (!res.ok) throw new Error("Failed to load item data");
        const data = await res.json();

        if (data.completions) {
          setInitialCompletions(data.completions);
          setCompletions(data.completions);
        }

        if (data.image) {
          setInitialImage(data.image);
          setPreview(data.image);
        }

        const ingList = data.ingredients ? data.ingredients.split("#") : [];
        const insList = data.instructions ? data.instructions.split("#") : [];

        setIngredients(ingList);
        setOriginalIngredients(ingList);
        setInstructions(insList);
        setOriginalInstructions(insList);
      } catch (e) {
        console.error(e);
        setInitialImage(null);
        setPreview(null);
      }
    }

    fetchItem();
  }, [type, item]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameChanged = name !== item && name.trim() !== "";
    const isCompletionsChanged = completions !== initialCompletions;
    const isImageChanged = !!file;

    const isIngredientsChanged =
      JSON.stringify(clean(ingredients)) !==
      JSON.stringify(clean(originalIngredients));

    const isInstructionsChanged =
      JSON.stringify(clean(instructions)) !==
      JSON.stringify(clean(originalInstructions));

    if (
      !isNameChanged &&
      !isCompletionsChanged &&
      !isImageChanged &&
      !isIngredientsChanged &&
      !isInstructionsChanged
    ) {
      alert("Please update something before saving.");
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

      type payloadType = {
        newItem?: string;
        completions?: number;
        image?: string;
        ingredients?: string;
        instructions?: string;
      };

      const payload: payloadType = {};
      if (isNameChanged) payload.newItem = name;
      if (isCompletionsChanged) payload.completions = completions;
      if (isImageChanged && imageUrl) payload.image = imageUrl;
      if (isIngredientsChanged)
        payload.ingredients = clean(ingredients).join("#");
      if (isInstructionsChanged)
        payload.instructions = clean(instructions).join("#");

      const res = await fetch(`/api/types/${type}/${item}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update item");
        return;
      }

      router.push(`/admin/types/${type}/${isNameChanged ? name : item}`);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-lg bg-white px-8 py-6 shadow-lg">
        <h2 className="mb-4 text-xl">تحرير المنتج</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${name ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              اسم المنتج
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={completions}
              onChange={(e) => setCompletions(Number(e.target.value))}
              placeholder=" "
              className="peer w-full rounded border px-3 py-2 focus:outline-none"
            />
            <span
              className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${name ? "-translate-y-4 text-sm text-gray-700" : ""} `}
            >
              العمليات
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
                setPreview(
                  selected ? URL.createObjectURL(selected) : initialImage,
                );
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
          {/* Ingredients List */}
          <div>
            <label className="font-medium">المكونات</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2"
                  value={ing}
                  onChange={(e) => {
                    const updated = [...ingredients];
                    updated[idx] = e.target.value;
                    setIngredients(updated);
                  }}
                  placeholder={`مكون ${idx + 1}`}
                />
                <button
                  type="button"
                  className="cursor-pointer text-red-500"
                  onClick={() =>
                    setIngredients(ingredients.filter((_, i) => i !== idx))
                  }
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 cursor-pointer text-sm text-blue-600"
              onClick={() => setIngredients([...ingredients, ""])}
            >
              ➕ إضافة مكون
            </button>
          </div>

          {/* Instructions List */}
          <div>
            <label className="font-medium">التعليمات</label>
            {instructions.map((ins, idx) => (
              <div key={idx} className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2"
                  value={ins}
                  onChange={(e) => {
                    const updated = [...instructions];
                    updated[idx] = e.target.value;
                    setInstructions(updated);
                  }}
                  placeholder={`خطوة ${idx + 1}`}
                />
                <button
                  type="button"
                  className="cursor-pointer text-red-500"
                  onClick={() =>
                    setInstructions(instructions.filter((_, i) => i !== idx))
                  }
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 cursor-pointer text-sm text-blue-600"
              onClick={() => setInstructions([...instructions, ""])}
            >
              ➕ إضافة خطوة
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}/${item}`)}
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
