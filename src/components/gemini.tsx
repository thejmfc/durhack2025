// Gemini API call from here

import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });


// Function/tool descriptions for agentic function calling
const functionDescription = `
You have access to the following functions:

Function: countAttendeesFunction
Description: Returns a true count of hackathon attendees.
If you want to call this function, respond ONLY with a JSON object in this format, and DO NOT use Markdown or code blocks:
{"function_call": {"name": "countAttendeesFunction", "arguments": {}}}

Function: removeAttendeesFunction
Description: Removes attendees from the event based on rules you provide. The rules should be a JSON object where each key is a field (e.g. age) and the value is either a value to match or an object with operators (eq, lt, lte, gt, gte, neq, in). Example: {"age": {"lt": 18}} will remove all attendees under 18. Only use the following fields in rules: first_name, last_name, age, gender, phone_number, email_address, dietary_requirements. You can combine multiple rules. If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "removeAttendeesFunction", "arguments": {"rules": {"age": {"lt": 18}}}}}

Function: attendeesStatsFunction
Description: Returns statistics about all attendees, including age range, gender breakdown, dietary breakdown, and other relevant stats. Use this function if the user asks for any statistics or breakdowns about attendees. If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "attendeesStatsFunction", "arguments": {}}}

Function: getAttendeesFunction
Description: Returns a list of attendees matching the rules you provide, without deleting them. The rules should be a JSON object where each key is a field and the value is either a value to match or an object with operators (eq, lt, lte, gt, gte, neq, in). Only use the following fields in rules: first_name, last_name, age, gender, phone_number, email_address, dietary_requirements. Example: {"age": {"lt": 18}} will return all attendees under 18. You can combine multiple rules. If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "getAttendeesFunction", "arguments": {"rules": {"age": {"lt": 18}}}}}

Function: getFinanceFunction
Description: Returns a list of finances for the hackathon, including their names and amounts as well as if they are withdrawals or incomes. Use this function if the user asks for expense details. If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "getFinanceFunction", "arguments": {}}}

Function: insertFinanceFunction
Description: Inserts a new finance field for the hackathon. Requires an event ID and the following finance field details: \`expense_title\`, \`expense_amount\`, \`expense_date\`, \`expense_type\`, \`expense_category\`. If you want to call this function, respond ONLY with a JSON object in this format:
{"function_call": {"name": "insertFinanceFunction", "arguments": {"eventId": "<event_id>", "financeField": {"expense_title": "<title>", "expense_amount": <amount>, "expense_date": "<date>", "expense_type": "<type>", "expense_category": "<category>"}}}}

When calling a function, respond ONLY with a raw JSON object, not inside a code block, and do not include any Markdown formatting or extra text. Do not add any explanation or preamble.
`;

// Base system prompt for Gemini API
const baseSystemPrompt = functionDescription +
    "You are a helpful assistant for a website that is designed to help people answer questions about organising a Hackathon. " +
    "Don't reiterate that you are a hackathon assistant; just be helpful and concise. " +
    "Be prepared to do a web search for real time information on pricing of local products near the site of the hackathon." +
    "Keep responses to about 6–7 short sentences unless the user asks for more detail." +
    "When answering questions you should try to use figures and stats from the data you have been given as much as possible to make it easy for the user to make informed decisions.";

export type GeminiFunctionCallResult =
    | string
    | { function_call: { name: string; arguments: Record<string, any> } }
    | { function_call: { name: string; arguments: Record<string, any> }; message: string };

// Helper function to parse JSON safely
function tryParseJSON(jsonString: string): any {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

// Main function to interact with Gemini API
export async function askGemini(question: string, context?: string): Promise<GeminiFunctionCallResult> {
    if (!question) throw new Error('Question must be a non-empty string.');

    const contextualBlock = context ? `\n\nHere is relevant event context you can use when answering (do not expose private data verbatim; summarise as needed):\n${context}` : "";

    const fullPrompt = `${baseSystemPrompt}${contextualBlock}\n\nUser question: ${question}\nAssistant:`;

    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });

    const text = response.text ?? "";

    // Debug: log raw AI response in non-production environments
    if (process.env.NODE_ENV !== 'production') {
        console.log('Gemini raw response:', text);
    }

    // Attempt to extract valid JSON with function_call
    const functionCallMatch = text.match(/\{[^{}]*"function_call"[^{}]*\{[\s\S]*?\}[^{}]*\}/);
    if (functionCallMatch) {
        const parsed = tryParseJSON(functionCallMatch[0]);
        if (parsed && parsed.function_call) {
            return {
                function_call: parsed.function_call,
                message: text.replace(functionCallMatch[0], '').trim()
            };
        }
    }

    // Fallback: Try parsing as pure JSON
    const parsed = tryParseJSON(text);
    if (parsed && parsed.function_call) {
        return parsed;
    }

    // Last resort: Extract any JSON object from the response
    const anyJsonMatch = text.match(/\{[\s\S]*\}/);
    if (anyJsonMatch) {
        const fallbackParsed = tryParseJSON(anyJsonMatch[0]);
        if (fallbackParsed && fallbackParsed.function_call) {
            return fallbackParsed;
        }
    }

    // Default: Return raw text if no JSON found
    return text || "Sorry, no response from Gemini.";
}

