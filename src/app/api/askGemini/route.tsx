import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/components/gemini";

export async function POST(req: NextRequest) {
    const { question } = await req.json();
    const answer = await askGemini(question);
    return NextResponse.json({ answer });
}
