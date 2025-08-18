"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();
  const handleClick = () => {
    signOut(auth);
    router.push("/login");
  };
  return (
    <div className="flex h-[80vh] w-screen flex-col items-center justify-center gap-1">
      <h1 className="text-3xl font-bold text-red-800">وصول غير المصرح به</h1>
      <p className="mb-1 text-xl">
        للوصول الى هذه الصفحة، قم بتسجيل الدخول باستخدام حساب معتمد.
      </p>
      <button
        onClick={handleClick}
        className="cursor-pointer rounded-md bg-black px-8 py-1 text-xl text-white transition-all duration-150 hover:opacity-85"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}
