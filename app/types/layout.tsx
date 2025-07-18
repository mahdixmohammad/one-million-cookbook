"use client"

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Loading from "@/components/Loading";
import NavBar from "@/components/NavBar";

export default function TypesLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const db = getDatabase();
      const roleRef = ref(db, `users/${user.uid}/role`);
      const snap = await get(roleRef);
      const role = snap.val();

      if (role !== "employee" && role !== "admin") {
        router.push("/not-authorized");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="w-screen h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
