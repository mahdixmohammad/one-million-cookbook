"use client";
import { use, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

type searchParams = {
    searchParams: Promise<{ from: "types" | "admin" }>
}

export default function LoginPage( {searchParams} : searchParams) {
  const { from = "types" } = use(searchParams);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
            router.push(`/${from}`);
            return;
        }});

        return () => unsub();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${from}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} dir="ltr" className="p-4 max-w-md mx-auto h-screen flex flex-col justify-center space-y-4">
      <Image className="mx-auto" src="/1M-logo.png" alt="" width={75} height={75} />
      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full font-bold bg-gold text-white p-3 cursor-pointer hover:opacity-85 transition-all duration-150">
        Login
      </button>
    </form>
  );
}
