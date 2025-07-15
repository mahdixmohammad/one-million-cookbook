"use client";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [originalIngredients, setOriginalIngredients] = useState<string[]>([]);
  const [originalInstructions, setOriginalInstructions] = useState<string[]>([]);
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

  const clean = (arr: string[]) => arr.map(s => s.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameChanged = name !== item && name.trim() !== "";
    const isImageChanged = !!file;

    const isIngredientsChanged =
      JSON.stringify(clean(ingredients)) !== JSON.stringify(clean(originalIngredients));

    const isInstructionsChanged =
      JSON.stringify(clean(instructions)) !== JSON.stringify(clean(originalInstructions));

    if (!isNameChanged && !isImageChanged && !isIngredientsChanged && !isInstructionsChanged) {
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

      const payload: any = {};
      if (isNameChanged) payload.newItem = name;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-lg px-8 py-6 shadow-lg w-full max-w-[550px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl mb-4">تحرير المنتج</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج"
          />

          {/* Image Upload */}
          <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
            <span className="text-gray-500">{file?.name || "اختار الصورة..."}</span>
            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">تصفح</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                setPreview(selected ? URL.createObjectURL(selected) : initialImage);
              }}
              className="hidden"
            />
          </label>

          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-48 object-contain rounded border"
              width={50}
              height={50}
            />
          )}

          {/* Ingredients List */}
          <div>
            <label className="font-medium">المكونات</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
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
                  className="text-red-500 cursor-pointer"
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 cursor-pointer"
              onClick={() => setIngredients([...ingredients, ""])}
            >
              ➕ إضافة مكون
            </button>
          </div>

          {/* Instructions List */}
          <div>
            <label className="font-medium">التعليمات</label>
            {instructions.map((ins, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
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
                  className="text-red-500 cursor-pointer"
                  onClick={() => setInstructions(instructions.filter((_, i) => i !== idx))}
                >
                  🗑
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-sm text-blue-600 cursor-pointer"
              onClick={() => setInstructions([...instructions, ""])}
            >
              ➕ إضافة خطوة
            </button>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={() => router.push(`/admin/types/${type}/${item}`)}
              className="px-4 py-2 w-24 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-150"
            >
              الغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 w-24 rounded bg-gray-600 text-white hover:bg-gray-700 cursor-pointer transition-all duration-150"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
