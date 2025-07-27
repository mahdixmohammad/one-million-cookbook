"use client"

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import AdminSideBar from "@/components/AdminSideBar";
import AdminNavBar from "@/components/AdminNavBar";
import Loading from "@/components/Loading";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login?from=admin");
        return;
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { active: true }).catch(console.error);
      
      const roleRef = ref(db, `users/${user.uid}/role`);
      const snap = await get(roleRef);
      const role = snap.val();

      if (role !== "admin") {
        router.push("/not-authorized");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <div className="w-screen h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <AdminNavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {children}
      </div>
    </div>
  );
}
