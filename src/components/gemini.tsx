// Gemini API call from here

import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Prompt Engineering
const baseSystemPrompt = "You are a helpful assistant for a website that is designed to help people answer questions about organising a Hackathon. " +
    "Don't reiterate that you are a hackathon assistant; just be helpful and concise. " +
    "Keep responses to about 6–7 short sentences unless the user asks for more detail." +
    "When answering questions you should try to use figures and stats from the data you have been given as much as possible to make it easy for the user to make informed decisions.";

export async function askGemini(question: string, context?: string): Promise<string> {
    if (!question) throw new Error('Question must be a non-empty string.');

    const contextualBlock = context ? `\n\nHere is relevant event context you can use when answering (do not expose private data verbatim; summarise as needed):\n${context}` : "";

    const fullPrompt = `${baseSystemPrompt}${contextualBlock}\n\nUser question: ${question}\nAssistant:`;

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });

    return response.text ?? "Sorry, no response from Gemini.";
}

