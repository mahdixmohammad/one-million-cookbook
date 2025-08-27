import { NextRequest, NextResponse } from "next/server";
import { rtdb } from "@/lib/firebase";
import { ref, get } from "firebase/database";

type Context = {
  params: Promise<{ date: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  const { date } = await context.params;
  try {
    const dateRef = ref(rtdb, `completions/${date}`);
    const snapshot = await get(dateRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
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
