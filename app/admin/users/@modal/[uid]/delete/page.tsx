"use client";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

type Props = {
  params: Promise<{ uid: string }>;
};

export default function EditTypeModal(props: Props) {
  let { uid } = use(props.params);
  uid = decodeURIComponent(uid);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUid === uid) {
      alert("لا يمكنك حذف حسابك الشخصي أثناء تسجيل الدخول.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.error || "Failed to delete type");
        return;
      }

      router.push(`/admin/users/`);
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
        <h2 className="mb-4 text-xl">حذف النوع</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p>
            هل أنت متأكد من رغبتك في حذف <strong>{uid}</strong> و جميع منتجاته؟
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push(`/admin/users`)}
              className="w-24 cursor-pointer rounded bg-gray-200 px-4 py-2 transition-all duration-150 hover:bg-gray-300"
            >
              الغاء
            </button>
            <button
              type="submit"
              className="w-24 cursor-pointer rounded bg-red-800 px-4 py-2 text-white transition-all duration-150 hover:bg-red-900"
            >
              حذف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
