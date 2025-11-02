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
        <div className="w-full max-w-full p-6 rounded-3xl bg-gradient-to-br from-white/80 via-blue-50 to-purple-50 shadow-2xl border-[1.5px] border-blue-200/40 flex flex-col relative overflow-hidden">

            {/* Accent Bar */}
            <div className="absolute left-0 top-0 w-full h-3 bg-purple-200 rounded-t-3xl" />

            {/* Header */}
            <div className="flex items-center gap-2 mb-4 mt-2 relative z-10">
                <h3 className="font-bold text-gray-700 text-lg tracking-tight flex items-center gap-2">
                    <span></span> {(hasEvents && !eventId) ? "Dashboard Assistant" : "Event Assistant"}
                </h3>
                {hasEvents && (
                    <select
                        className="ml-auto text-xs border border-blue-200 rounded-md px-2 py-1 bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-400 transition"
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

            {/* Messages */}
            <div className="mb-3 h-64 overflow-y-auto rounded-xl bg-white/60 px-4 py-3 border border-purple-100 shadow-inner space-y-2 scrollbar-thin scrollbar-thumb-purple-200">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`
          ${msg.sender === "user"
                            ? "bg-gradient-to-br from-blue-500/90 to-purple-500/60 text-white font-medium"
                            : "bg-white border border-blue-100 text-blue-900"
                        }
          px-3 py-2 rounded-xl max-w-[80%] transition-all shadow
        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-purple-400 italic text-xs">Assistant is typing…</div>}
            </div>

            {/* Files */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {files.map(f => (
                        <span key={f.name} className="text-xs bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200">
          <span className="truncate max-w-[7rem]">{f.name}</span>
          <button className="text-red-400 hover:text-red-600" onClick={() => removeFile(f.name)}>×</button>
        </span>
                    ))}
                </div>
            )}

            {/* Form */}
            <form
                className="flex items-stretch gap-2"
                onSubmit={e => { e.preventDefault(); handleSend(); }}>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs border border-gray-300 shadow-sm flex items-center gap-1 transition">
                    <span className="text-lg">📎</span>
                    <span>Attach</span>
                    <input type="file" className="hidden" multiple onChange={onPickFiles} />
                </label>
                <input
                    className="flex-1 min-w-0 border border-blue-100 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-purple-300 text-sm shadow-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={selectedEventId ? "Ask about your event…" : "Ask anything… (optional: pick an event)"}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-blue-50 hover:bg-blue-100 text-gray-700 font-semibold px-5 py-2 rounded-lg text-sm shadow-sm transition duration-200 disabled:opacity-60"
                    disabled={loading}
                >
                    Send
                </button>
            </form>
        </div>

    );
}
