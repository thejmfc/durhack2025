// Gemini API call from here

import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Prompt Engineering
const hackathonContext = "You are a helpful chatbot assistant, for a website that is designed for helping Hackathon Organisers plan a hackathon." +
    "They may ask things about event logistics, planning, rules and workshops." +
    "Please keep your answers short, concise and relevant (no more than about 6~7 short sentences)."

export async function askGemini(question: string): Promise<string> {
    if (!question) throw new Error('Question must be a non-empty string.');

    const fullPrompt = `${hackathonContext}\nUser question: ${question}\nAssistant question:`;

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });

    // Use fallback text if undefined
    return response.text ?? "Sorry, no response from Gemini.";
}

