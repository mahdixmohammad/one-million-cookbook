"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { customSignOut } from "@/lib/db/users";

export default function NotAuthorizedPage() {
  const router = useRouter();

  const handleClick = async () => {
    await customSignOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex h-[90vh] w-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-4xl font-bold text-red-700">وصول غير المصرح به</h1>
      <p className="text-xl">
        للوصول الى هذه الصفحة،<br></br> قم بتسجيل الدخول باستخدام حساب معتمد.
      </p>
      <button
        onClick={handleClick}
        className="cursor-pointer rounded-md bg-red-700 px-12 py-1 text-xl text-white transition-all duration-150 hover:opacity-85"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}
