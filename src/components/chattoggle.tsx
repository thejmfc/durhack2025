import Box from "@/components/box";
import { useState } from "react";
import ChatUI from "@/components/talkjs"; // Adjust this path to where your ChatUI lives

export default function ChatToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Floating chat toggle button */}
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md mb-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Close Chat" : "AI Chat"}
            </button>

            {/* The AI chat pops up above the button */}
            {isOpen && (
                <Box className="w-80">
                    <ChatUI />
                </Box>
            )}
        </div>
    );
}
