import { rtdb } from "@/lib/firebase";
import { ref, get, set, push, runTransaction } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import { formatter } from "@/utils/format-time";

export async function GET() {
  try {
    const completionsRef = ref(rtdb, "completions");
    const snapshot = await get(completionsRef);

    if (!snapshot.exists()) {
      return NextResponse.json([]);
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error with getting completions:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, item, uid, quantity } = body;

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

    const now = new Date();
    const isoString = now.toISOString();
    const dateKey = formatter.format(now).split(",")[0];

    const newCompletionRef = push(ref(rtdb, `completions/${dateKey}`));

    await set(newCompletionRef, {
      type,
      item,
      uid,
      quantity,
      date: isoString,
    });

    const itemCompletionsRef = ref(
      rtdb,
      `types/${type}/items/${item}/completions`,
    );
    await runTransaction(itemCompletionsRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });

    return NextResponse.json({
      dateKey,
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
