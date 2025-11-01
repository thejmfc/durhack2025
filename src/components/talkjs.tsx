import { useState } from "react";

// Defines the shape of a chat message, sender (user or bot) and message (string)
interface Message {
    sender: "user" | "bot";
    text: string;
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([]); // State for all chat messages
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // If a user is sending a new message
    async function handleSend() {
        if (!input.trim()) return; // return empty is no string
        setMessages([...messages, { sender: "user", text: input }]);
        setLoading(true);

        // Send over the user's question to the backend Gemini API route
        const res = await fetch("/api/askGemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: input }),
        });


        const data = await res.json();

        // Add the bots reply to the chat window
        setMessages(msgs =>
            [...msgs, { sender: "bot", text: data.answer }]
        );

        // Clear the input field for the next entry
        setInput("");
        setLoading(false);
    }

    // UI rendering, styles
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-lg">
            <div className="mb-2 h-64 overflow-y-auto border rounded-lg bg-gray-50 px-3 py-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`mb-1 ${
                            msg.sender === "user"
                                ? "text-blue-600 text-right"
                                : "text-gray-700 text-left"
                        }`}
                    >
                        <span className="font-semibold">{msg.sender === "user" ? "You:" : "Bot:"} </span>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="text-gray-400 italic">Bot is typing...</div>}
            </div>
            <form
                className="flex mt-1 gap-2"
                onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                }}
            >
                <input
                    className="flex-1 border rounded-lg px-3 py-1 focus:outline-none focus:ring focus:border-blue-400 text-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything about the hackathon!"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
                    disabled={loading}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
