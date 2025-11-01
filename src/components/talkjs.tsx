"use client";
import { useEffect, useMemo, useState } from "react";

interface Message {
    sender: "user" | "bot";
    text: string;
}

interface SimpleEvent { event_id: string; event_title: string }

interface ChatUIProps {
    eventId?: string;
    events?: SimpleEvent[];
}

export default function ChatUI({ eventId, events = [] }: ChatUIProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(eventId);

    // On first mount, if no eventId was provided, restore the last selected event from localStorage
    useEffect(() => {
        if (!eventId) {
            try {
                const last = localStorage.getItem("last_selected_event_id");
                if (last) setSelectedEventId(last || undefined);
            } catch {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const storageKey = useMemo(() => `chat_history_${selectedEventId || 'no_event'}`, [selectedEventId]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) setMessages(JSON.parse(saved));
        } catch {}
    }, [storageKey]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(messages));
        } catch {}
    }, [messages, storageKey]);

    // Persist the last selected event id so navigating between pages restores the same chat scope
    useEffect(() => {
        try {
            if (selectedEventId) localStorage.setItem("last_selected_event_id", selectedEventId);
        } catch {}
    }, [selectedEventId]);

    function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const picked = Array.from(e.target.files);
        setFiles(prev => [...prev, ...picked]);
        e.target.value = "";
    }

    function removeFile(name: string) {
        setFiles(prev => prev.filter(f => f.name !== name));
    }

    async function buildFilesContext(): Promise<string> {
        const parts: string[] = [];
        for (const f of files) {
            if (f.type.startsWith("text/") || f.type === "application/json") {
                try {
                    const text = await f.text();
                    parts.push(`File: ${f.name}\n---\n${text.substring(0, 8000)}${text.length > 8000 ? "\n...[truncated]" : ""}`);
                } catch {}
            } else {
                parts.push(`File: ${f.name} (type ${f.type}) attached — content not previewed; use it as context if supported.`);
            }
        }
        return parts.join("\n\n");
    }

    async function handleSend() {
        if (!input.trim() && files.length === 0) return;
        const userMsg = [input, files.length ? `\n[${files.length} file(s) attached]` : ""].join("");
        setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
        setLoading(true);

        const filesContext = await buildFilesContext();
        const res = await fetch("/api/askGemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: input || "Consider the attached files and provide insights.",
                eventId: selectedEventId,
                context: filesContext || undefined,
            }),
        });
        const data = await res.json();

        setMessages(msgs => [...msgs, { sender: "bot", text: data.answer || data.error || "No response" }]);
        setInput("");
        setFiles([]);
        setLoading(false);
    }

    const hasEvents = events && events.length > 0;

    return (
        <div className="w-80 max-w-full p-4 rounded-2xl shadow-xl bg-white/70 backdrop-blur border border-white/40 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800">AI Assistant</h3>
                {hasEvents && (
                    <select
                        className="ml-auto text-sm border rounded-md px-2 py-1 bg-white"
                        value={selectedEventId || ""}
                        onChange={e => setSelectedEventId(e.target.value || undefined)}
                    >
                        <option value="">No Event</option>
                        {events.map(ev => (
                            <option key={ev.event_id} value={ev.event_id}>{ev.event_title}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className="mb-2 h-64 overflow-y-auto rounded-lg bg-white/60 px-3 py-2 border border-white/50">
                {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"} px-3 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap text-sm`}>{msg.text}</div>
                    </div>
                ))}
                {loading && <div className="text-gray-500 italic text-sm">Assistant is typing…</div>}
            </div>

            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {files.map(f => (
                        <span key={f.name} className="text-xs bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                            {f.name}
                            <button className="text-red-600" onClick={() => removeFile(f.name)}>×</button>
                        </span>
                    ))}
                </div>
            )}

            <form
                className="flex items-stretch gap-2 flex-nowrap"
                onSubmit={e => { e.preventDefault(); handleSend(); }}
            >
                <label className="shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                    Attach
                    <input type="file" className="hidden" multiple onChange={onPickFiles} />
                </label>
                <input
                    className="flex-1 min-w-0 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-400 text-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={selectedEventId ? "Ask about your event…" : "Ask anything… (optional: pick an event)"}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
                    disabled={loading}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
