import { rtdb } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const typesRef = ref(rtdb, "types");
    const snapshot = await get(typesRef);

    if (!snapshot.exists()) {
      return NextResponse.json([], { status: 200 });
    }

    const data = snapshot.val();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch from RTDB:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, image } = body;

    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "Type name is required and must be a string" }, { status: 400 });
    }

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Image URL is required and must be a string" }, { status: 400 });
    }

    const typeRef = ref(rtdb, `types/${type}`);

    const snapshot = await get(typeRef);
    if (snapshot.exists()) {
      return NextResponse.json({ error: "Type already exists" }, { status: 409 });
    }

    await set(typeRef, { image, completions: 0 });

    return NextResponse.json({ success: true, message: `Type '${type}' created.` });
  } catch (err) {
    console.error("Error creating type:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
