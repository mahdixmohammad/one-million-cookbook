"use client";
import { use, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

type searchParams = {
  searchParams: Promise<{ from: "types" | "admin" }>;
};

export default function LoginPage({ searchParams }: searchParams) {
  const { from = "types" } = use(searchParams);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push(`/${from}`);
    });
    return () => unsub();
  }, [router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (identifier.includes("@")) {
        const userData = await signInWithEmailAndPassword(
          auth,
          identifier,
          password,
        );
        const { uid } = userData.user;

        // Track login info in DB
        await fetch("/api/auth/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        });
      } else {
        // Call API to resolve identifier → email
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to find user");

        const { email } = data;
        const userData = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const { uid } = userData.user;

        // Track login info in DB
        await fetch("/api/auth/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        });
      }
      router.push(`/${from}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-[90vh] max-w-md flex-col justify-center space-y-4 p-4"
    >
      <Image
        className="mx-auto"
        src="/one-million-logo.jpg"
        alt=""
        width={200}
        height={200}
      />
      <div className="relative">
        <input
          className={`peer w-full rounded border px-3 py-2 focus:outline-none ${identifier ? "text-left" : "text-right"}`}
          type="text"
          dir={identifier ? "ltr" : "rtl"} // RTL for placeholder, LTR when typing
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <span
          className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${identifier ? "-translate-y-4 text-sm text-gray-700" : ""} `}
        >
          اسم المستخدم
        </span>
      </div>
      <div className="relative">
        <input
          className={`peer w-full rounded border px-3 py-2 focus:outline-none ${password ? "text-left" : "text-right"}`}
          type="password"
          dir={password ? "ltr" : "rtl"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className={`pointer-events-none absolute top-2 right-2 bg-white px-1 text-gray-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-gray-700 ${password ? "-translate-y-4 text-sm text-gray-700" : ""} `}
        >
          كلمة المرور
        </span>
      </div>
      <button
        type="submit"
        className="w-full cursor-pointer bg-black p-3 font-bold text-white transition-all duration-150 hover:opacity-85"
      >
        تسجيل الدخول
      </button>
    </form>
  );
}
