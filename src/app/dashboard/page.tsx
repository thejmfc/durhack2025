"use client";
import { useAuth } from "@/context/AuthContext";
import EventCard from "../../components/event_card";
import supabase from "@/Supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCreate from "@/components/event_create";
import LogoutButton from "@/components/logoutButton";
import ChatToggle from "@/components/chattoggle";

export default function Dashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("hackathons")
                .select("*")
                .eq("event_owner", user.id);

            if (error) setError(error.message);
            else setEvents(data ?? []);
            setLoading(false);
        };
        fetchEvents();
    }, [user]);

    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime()
    );

    const nextUpcoming = events
        .filter(e => new Date(e.event_start_date) > new Date())
        .sort(
            (a, b) =>
                new Date(a.event_start_date).getTime() -
                new Date(b.event_start_date).getTime()
        )[0];

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');
          @keyframes bgGradientSlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-bgGradientSlow {
            background-size: 200% 200%;
            animation: bgGradientSlow 40s ease infinite;
          }
        `}
            </style>
            <main className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-100 via-indigo-200 to-blue-200 animate-bgGradientSlow relative">
                {/* Subtle geometric background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_2px,transparent_3px,transparent_15px)] z-0"></div>

                <LogoutButton />
                <section className="container mx-auto px-7 pt-8 pb-14 flex flex-col gap-6 relative z-10">
                    <h1
                        className="text-4xl font-extrabold text-center mb-6 tracking-tight"
                        style={{ fontFamily: "'Exo 2', sans-serif" }}
                    >
                        {user?.email ? `Welcome back ${(user.email)?.split("@")[0]}!` : "Welcome back!"}
                    </h1>
                    {loading && (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
                        </div>
                    )}

                    {!loading && sortedEvents.length === 0 && (
                        <div className="flex flex-col items-center py-10">
                            <h2 className="text-2xl text-gray-700 font-semibold mb-2">You have no events yet</h2>
                            <p className="text-gray-500">Add your first event</p>
                        </div>
                    )}

                    {!loading && sortedEvents.length > 0 && (
                        <>
                            {/* Next Upcoming Event */}
                            {nextUpcoming && (
                                <Link
                                    href={`/dashboard/${nextUpcoming.event_id}`}
                                    key={nextUpcoming.event_id}
                                    className="block mx-auto max-w-3xl"
                                    style={{ textDecoration: 'none' }}>
                                    <div className="w-full rounded-3xl bg-white/80 backdrop-blur shadow-2xl border border-indigo-100 px-7 py-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-indigo-50 transition duration-300">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">Next Event: {nextUpcoming.event_title}</h2>
                                            <div className="text-gray-600 font-medium text-lg">{nextUpcoming.event_location}</div>
                                        </div>
                                        <div className="flex-shrink-0 text-indigo-700 bg-indigo-100 rounded-full py-2 px-6 text-lg font-bold shadow">
                                            In {Math.ceil((new Date(nextUpcoming.event_start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Events Grid */}
                            <div className="flex flex-col items-center">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-8 mt-10">
                                    {sortedEvents.map((e) => (
                                        <Link
                                            href={`/dashboard/${e.event_id}`}
                                            key={e.event_id}
                                            className="transition-transform duration-200 hover:scale-105 active:scale-98"
                                            style={{ textDecoration: 'none' }}>
                                            <EventCard {...e} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </section>
                {/* Floating "+" event button */}
                <div className="fixed bottom-7 left-7 z-20">
                    <EventCreate />
                </div>
                {/* Floating AI chat assistant available on all dashboard pages */}
                <ChatToggle events={events.map(e => ({ event_id: e.event_id, event_title: e.event_title }))} />
            </main>
        </>
    );
}
