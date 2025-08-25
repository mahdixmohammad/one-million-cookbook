"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { onDisconnect, getDatabase, ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import NavBar from "@/components/NavBar";
import useInactivityLogout from "@/hooks/useInactivityLogout";
import LoadingScreen from "@/components/LoadingScreen";

export default function TypesLayout({ children }: { children: ReactNode }) {
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

        if (userData.disconnected === true) {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid }),
          });
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

        onDisconnect(ref(db, `users/${user.uid}`)).update({
          disconnected: true,
        });
      } catch (error) {
        console.error("Error checking user active status:", error);
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        await signOut(auth);
        router.push("/login?from=types");
      }
    });

    return () => unsub();
  }, [router]);

  useInactivityLogout(uid);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
