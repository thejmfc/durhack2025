"use client";
import Box from "@/components/box";
import { useState } from "react";
import ChatUI from "@/components/talkjs";

interface SimpleEvent { event_id: string; event_title: string }

export default function ChatToggle({ eventId, events = [] }: { eventId?: string; events?: SimpleEvent[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="fixed bottom-1 right-5 z-50 flex flex-col items-end gap-4 border-[10px] border-transparent"
        >
        <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-full shadow-lg mb-1 whitespace-nowrap"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="ai-chat-panel"
            >
                {isOpen ? "Close AI" : "AI Chat"}
            </button>

            {isOpen && (
                <Box className="w-80 sm:w-96 md:w-[28rem] max-w-[90vw]" id="ai-chat-panel">
                    <ChatUI eventId={eventId} events={events} />
                </Box>
            )}
        </div>
    );
}
