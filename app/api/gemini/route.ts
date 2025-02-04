import { NextResponse, NextRequest } from "next/server";
import { GeminiService } from "../generate/generate";

const geminiService = new GeminiService();

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.text();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await geminiService.getResponse(prompt);
    return NextResponse.json(response);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error
          ? `Oops! Something went wrong while generating your problem issue: ${error.message}`
          : "Our service is temporarily unavailable. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}