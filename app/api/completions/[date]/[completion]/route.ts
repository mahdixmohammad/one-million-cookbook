import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ date: string; completion: string }> },
) {
  try {
    const { date, completion } = await context.params;
    const completionRef = ref(rtdb, `completions/${date}/${completion}`);
    const snapshot = await get(completionRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Completion not found" },
        { status: 404 },
      );
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error with completion:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
