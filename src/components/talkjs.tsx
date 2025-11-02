"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import supabase from "@/Supabase";
import { useAuth } from "@/context/AuthContext";

interface Message {
    sender: "user" | "bot";
    text: string;
    created_at?: string;
    pending?: boolean;
}

interface SimpleEvent { event_id: string; event_title: string }

interface ChatUIProps {
    eventId?: string;
    events?: SimpleEvent[];
}

export default function ChatUI({ eventId, events = [] }: ChatUIProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(eventId);
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const storageKey = useMemo(() => `chat_history_${user?.id || 'anon'}_${selectedEventId || 'no_event'}`, [selectedEventId, user?.id]);

    // Load history: prefer Supabase for signed-in users, fallback to localStorage
    useEffect(() => {
        let cancelled = false;
        async function load() {
            // Clear while loading to avoid mixing contexts
            setMessages([]);
            if (user) {
                try {
                    let query = supabase
                        .from("chat_messages")
                        .select("role,text,created_at")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: true }) as any;
                    if (selectedEventId) {
                        query = query.eq("event_id", selectedEventId);
                    } else {
                        query = query.is("event_id", null);
                    }
                    const { data, error } = await query;
                    if (error) throw error;
                    if (!cancelled && data) {
                        const msgs: Message[] = data.map((row: any) => ({
                            sender: (row.role as "user" | "bot") || "bot",
                            text: row.text,
                            created_at: row.created_at,
                        }));
                        let finalMsgs = msgs;
                        try {
                            const saved = localStorage.getItem(storageKey);
                            if (saved) {
                                const localMsgs: Message[] = JSON.parse(saved);
                                if (localMsgs.length > msgs.length) {
                                    finalMsgs = localMsgs;
                                }
                            }
                        } catch {}
                        setMessages(finalMsgs);
                    }
                    return;
                } catch (e) {
                    // fall back to localStorage
                    console.warn("Chat history: falling back to localStorage", e);
                }
            }
            try {
                const saved = localStorage.getItem(storageKey);
                if (!cancelled && saved) setMessages(JSON.parse(saved));
            } catch {}
        }
        load();
        return () => { cancelled = true; };
    }, [storageKey, selectedEventId, user]);

    // Persist to localStorage as a secondary cache
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

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, loading]);

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

    async function saveMessage(role: "user" | "bot", text: string, createdAt?: string) {
        const created_at = createdAt || new Date().toISOString();
        // Save to local state immediately
        let pending = false;
        setMessages(prev => [...prev, { sender: role, text, created_at, pending }]);
        // Try to persist to Supabase if signed-in
        if (user) {
            try {
                const { error, status } = await supabase.from("chat_messages").insert({
                    user_id: user.id,
                    event_id: selectedEventId || null,
                    role,
                    text,
                    created_at,
                });
                if (error) {
                    console.warn("Supabase insert failed (", status, ") for", role, error.message);
                    pending = true;
                }
            } catch (e) {
                console.warn("Failed to persist chat message, cached locally only.", e);
                pending = true;
            }
            if (pending) {
                // Mark last message as pending to indicate it wasn't saved remotely; it will still be in localStorage
                setMessages(prev => {
                    const copy = [...prev];
                    const idx = copy.length - 1;
                    if (idx >= 0) copy[idx] = { ...copy[idx], pending: true };
                    return copy;
                });
            }
        }
    }

    async function handleSend() {
        if (!input.trim() && files.length === 0) return;
        const userMsg = [input, files.length ? `\n[${files.length} file(s) attached]` : ""].join("");
        setLoading(true);
        await saveMessage("user", userMsg);

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
        await saveMessage("bot", data.answer || data.error || "No response");
        setInput("");
        setFiles([]);
        setLoading(false);
    }

    async function clearHistory() {
        // Clear local state and localStorage immediately for snappy UX
        setMessages([]);
        try { localStorage.removeItem(storageKey); } catch {}
        // Delete from Supabase for signed-in users
        if (user) {
            try {
                let del = supabase
                    .from("chat_messages")
                    .delete()
                    .eq("user_id", user.id) as any;
                if (selectedEventId) {
                    del = del.eq("event_id", selectedEventId);
                } else {
                    del = del.is("event_id", null);
                }
                await del;
            } catch (e) {
                console.warn("Failed to clear remote chat history", e);
            }
        }
    }

    function copyToClipboard(text: string) {
        try { navigator.clipboard.writeText(text); } catch {}
    }

    const hasEvents = events && events.length > 0;

    return (
        <div className="w-full max-w-full p-4 sm:p-6 rounded-3xl bg-slate-900/70 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col relative overflow-hidden">
            {/* Solid orange accent bar (no gradient) */}
            <div className="absolute left-0 top-0 w-full h-3 bg-orange-500 rounded-t-3xl opacity-80" />

            {/* Header */}
            <div className="flex items-center gap-2 mb-2 mt-5 relative z-10">
                <h3 className="font-bold text-slate-100 text-lg tracking-tight flex items-center gap-2">
                    <span></span> {(hasEvents && !eventId) ? "Dashboard Assistant" : "Event Assistant"}
                </h3>
                {hasEvents && (
                    <select
                        className="ml-auto text-xs border border-white/20 rounded-md px-2 py-1 bg-slate-800/70 text-slate-200 focus:ring-2 focus:ring-orange-500 transition"
                        value={selectedEventId || ""}
                        onChange={e => setSelectedEventId(e.target.value || undefined)}
                    >
                        <option value="">No Event</option>
                        {events.map(ev => (
                            <option key={ev.event_id} value={ev.event_id}>{ev.event_title}</option>
                        ))}
                    </select>
                )}
                <button
                    onClick={clearHistory}
                    title="Clear chat history"
                    className="ml-2 text-xs px-2 py-1 rounded-md border border-orange-400 text-orange-300 hover:bg-orange-900/20 transition"
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="
            mb-3 h-64 overflow-y-auto rounded-xl bg-slate-900/80 backdrop-blur border border-orange-900/20 shadow-inner space-y-2 scrollbar-thin scrollbar-thumb-orange-400">
                {messages.map((msg, i) => (
                    <div key={i} className={`group flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`
                        ${msg.sender === "user"
                            ? "bg-orange-500 text-white font-semibold"
                            : "bg-slate-800/70 border border-orange-900 text-orange-100"
                        }
                        px-3 py-2 rounded-xl max-w-[80%] transition-shadow shadow whitespace-pre-wrap relative
                    `}>
                            <div className="text-[10px] opacity-60 mb-0.5">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}</div>
                            <div>{msg.text}</div>
                            {msg.sender === "bot" && (
                                <button
                                    onClick={() => copyToClipboard(msg.text)}
                                    className="hidden group-hover:block absolute -top-2 -right-2 bg-slate-200 border border-gray-400 text-slate-700 text-[10px] px-2 py-0.5 rounded-full shadow"
                                    title="Copy"
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="animate-pulse text-orange-400 italic text-xs">Assistant is typing…</div>}
            </div>

            {/* Files */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {files.map(f => (
                        <span key={f.name} className="text-xs bg-orange-900/30 text-slate-100 px-3 py-1 rounded-full flex items-center gap-1 border border-orange-400/30">
                        <span className="truncate max-w-[7rem]">{f.name}</span>
                        <button className="text-orange-400 hover:text-orange-600" onClick={() => removeFile(f.name)}>×</button>
                    </span>
                    ))}
                </div>
            )}

            {/* Form */}
            <form
                className="flex items-stretch gap-2"
                onSubmit={e => { e.preventDefault(); handleSend(); }}>
                <label className="cursor-pointer bg-slate-800/60 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs border border-slate-700 shadow-sm flex items-center gap-1 transition">
                    <span className="text-lg">📎</span>
                    <span>Attach</span>
                    <input type="file" className="hidden" multiple onChange={onPickFiles} />
                </label>
                <input
                    className="flex-1 min-w-0 border border-orange-400 bg-slate-900/70 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-orange-400 text-sm shadow-sm text-slate-100"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={selectedEventId ? "Ask about your event…" : "Ask anything… (optional: pick an event)"}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-sm transition duration-200 disabled:opacity-85"
                    disabled={loading || (!input.trim() && files.length === 0)}
                >
                    {loading ? "Sending…" : "Send"}
                </button>
            </form>
        </div>
    );


}
