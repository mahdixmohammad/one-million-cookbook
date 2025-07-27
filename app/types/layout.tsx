"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { onDisconnect, getDatabase, ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Loading from "@/components/Loading";
import NavBar from "@/components/NavBar";
import useInactivityLogout from "@/hooks/useInactivityLogout";

export default function TypesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login?from=types");
        return;
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      try {
        const userSnap = await get(userRef);
        if (!userSnap.exists()) {
          // User not in DB, sign out and redirect
          await signOut(auth);
          router.push("/login?from=types");
          return;
        }

        const userData = userSnap.val();

        // Check active flag
        if (userData.active === false) {
          await signOut(auth);
          router.push("/login?from=types");
          return;
        }

        // Check role
        if (userData.role !== "employee" && userData.role !== "admin") {
          router.push("/not-authorized");
          return;
        }

        setUid(user.uid);
        setLoading(false);

        onDisconnect(ref(db, `users/${user.uid}`)).update({ active: false });

      } catch (error) {
        console.error("Error checking user active status:", error);
        await signOut(auth);
        router.push("/login?from=types");
      }
    });

    return () => unsub();
  }, [router]);

  const { timeLeft } = useInactivityLogout(uid);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <>
      <NavBar />
      {children}
      <div className="fixed bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded shadow">
        Inactivity logout in: {formatTime(timeLeft)}
      </div>
    </>
  );
}
