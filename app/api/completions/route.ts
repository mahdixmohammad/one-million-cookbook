import { rtdb } from "@/lib/firebase";
import { ref, set, push, runTransaction } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, item, uid } = body;
    const newCompletionRef = push(ref(rtdb, "completions"));

    await set(newCompletionRef, {
      type,
      item,
      uid,
      date: new Date().toISOString(),
    });

    const userCompletionsRef = ref(rtdb, `users/${uid}/completions`);
    await runTransaction(userCompletionsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    const typeCompletionsRef = ref(rtdb, `types/${type}/completions`);
    await runTransaction(typeCompletionsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    const itemCompletionsRef = ref(
      rtdb,
      `types/${type}/items/${item}/completions`,
    );
    await runTransaction(itemCompletionsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    return NextResponse.json({ success: true, message: "Completion created." });
  } catch (err) {
    console.error("Error with completion:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
