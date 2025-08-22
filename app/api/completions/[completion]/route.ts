import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ completion: string }> },
) {
  try {
    const { completion } = await context.params;
    const completionRef = ref(rtdb, `completions/${completion}`);
    const snapshot = await get(completionRef);

    if (!snapshot.exists()) {
      return NextResponse.json([], { status: 200 });
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
