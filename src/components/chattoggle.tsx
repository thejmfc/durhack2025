"use client";
import Box2 from "@/components/box2";
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
                className="
                bg-slate-900/80 border border-white/10 shadow-xl
                text-slate-100 px-6 py-3 rounded-full mb-1 whitespace-nowrap transition
                backdrop-blur-lg
                hover:bg-indigo-600 hover:to-indigo-600 hover:text-white"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="ai-chat-panel"
            >
                {isOpen ? "Close AI" : "AI Chat"}
            </button>


            {isOpen && (
                <Box2 className="w-80 sm:w-96 md:w-[28rem] max-w-[90vw]">
                    <ChatUI eventId={eventId} events={events} />
                </Box2>
            )}
        </div>
    );
}
