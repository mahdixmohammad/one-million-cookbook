"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDatabase, ref, update } from "firebase/database";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 mins
// For testing, set to 10 seconds: const INACTIVITY_LIMIT = 10 * 1000;

export default function useInactivityLogout(uid: string | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(INACTIVITY_LIMIT);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(INACTIVITY_LIMIT);

    // Countdown tick
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    timeoutRef.current = setTimeout(async () => {
      if (uid) {
        const db = getDatabase();
        await update(ref(db, `users/${uid}`), { active: false });
        await signOut(auth);
        location.reload();
      }
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    if (!uid) return;

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uid]);

  return { timeLeft };
}
