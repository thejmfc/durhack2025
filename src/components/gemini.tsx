// Gemini API call from here

import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });


// Add function/tool description for agentic function calling
const functionDescription = `
You have access to the following function:
Function: countAttendeesFunction
Description: Returns a true count of hackathon attendees
If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "countAttendeesFunction", "arguments": {"name": "<name>"}}}
If you do not want to call a function, answer as normal.
`;

const baseSystemPrompt = functionDescription +
    "You are a helpful assistant for a website that is designed to help people answer questions about organising a Hackathon. " +
    "Don't reiterate that you are a hackathon assistant; just be helpful and concise. " +
    "Be prepared to do a web search for real time information on pricing of local products near the site of the hackathon." +
    "Keep responses to about 6–7 short sentences unless the user asks for more detail." +
    "When answering questions you should try to use figures and stats from the data you have been given as much as possible to make it easy for the user to make informed decisions.";


export async function askGemini(question: string, context?: string): Promise<string | { function_call: { name: string, arguments: { name: string } } }> {
    if (!question) throw new Error('Question must be a non-empty string.');

    const contextualBlock = context ? `\n\nHere is relevant event context you can use when answering (do not expose private data verbatim; summarise as needed):\n${context}` : "";

    const fullPrompt = `${baseSystemPrompt}${contextualBlock}\n\nUser question: ${question}\nAssistant:`;

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });

    const text = response.text ?? "";
    // Try to parse a function_call JSON if present
    try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.function_call) {
            return parsed;
        }
    } catch (e) {
        // Not JSON, just return text
    }
    return text || "Sorry, no response from Gemini.";
}

