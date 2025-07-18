"use client"
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
    const router = useRouter()
    const handleClick = () => {
        signOut(auth)
        router.push("/login")
    }
    return (
        <div className="w-screen h-[80vh] flex flex-col justify-center items-center gap-1">
            <h1 className="text-red-800 text-3xl font-bold">وصول غير المصرح به</h1>
            <p className="text-xl mb-1">للوصول الى هذه الصفحة، قم بتسجيل الدخول باستخدام حساب معتمد.</p>
            <button
            onClick={handleClick}
            className="bg-black text-white text-xl px-8 py-1 cursor-pointer rounded-md"
            >
            تسجيل الخروج
            </button>
        </div>
    );
}