import { rtdb } from "@/lib/firebase";
import { ref, set, push, runTransaction } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, item, uid, quantity } = body;
    const newCompletionRef = push(ref(rtdb, "completions"));

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Type name is required and must be a string" },
        { status: 400 },
      );
    }

    if (!item || typeof item !== "string") {
      return NextResponse.json(
        { error: "Item name is required and must be a string" },
        { status: 400 },
      );
    }

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    if (!quantity || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Quantity is required and must be a number" },
        { status: 400 },
      );
    }

    await set(newCompletionRef, {
      type,
      item,
      uid,
      quantity,
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

    return NextResponse.json({
      completionId: newCompletionRef.key,
      success: true,
      message: "Completion created.",
    });
  } catch (err) {
    console.error("Error with completion:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
