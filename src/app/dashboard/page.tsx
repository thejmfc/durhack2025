"use client";
import { useAuth } from "@/context/AuthContext";
import EventCard from "../../components/event_card"
import supabase from "@/Supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/logoutButton";

export default function Dashboard() {
  const { user, session } = useAuth();

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
    console.log(events)
  }, [user]);

    const sortedEvents = [...events].sort((a, b) => 
        new Date(b.event_start_date).getTime() - new Date(a.event_start_date).getTime()
    );

    const nextUpcoming = events
      .filter(e => new Date(e.event_start_date) > new Date())
      .sort((a, b) => new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime())[0];
    
    return (
        <section className="flex flex-col w-full">
            <LogoutButton />
            <h1 className="text-4xl text-center m-5">Welcome back {(user?.email)?.split("@")[0]}!</h1>

            {nextUpcoming &&
                <Link href={`/dashboard/${nextUpcoming.event_id}`} key={nextUpcoming.event_id} className="w-full justify-center flex mb-5">
                    <div id="nextUpcoming" className="w-5/6 rounded-xl bg-gray-400 px-2 py-5 flex align-middle justify-between">
                        <h2 className="text-xl font-bold">Next Event: {nextUpcoming.event_title}</h2>
                      <p className="mr-5">In {Math.ceil((new Date(nextUpcoming.event_start_date) - Date.now()) / (1000 * 60 * 60 * 24))} Days</p>
                    </div>
                </Link>
            }

            {sortedEvents.length == 0 && 
                <h2 className="text-center mt-15">You have no events! Add one now</h2>
            }

            <div className="w-full flex flex-col items-center">


                <div className="grid grid-cols-3 w-5/6 gap-2">

                    {sortedEvents.map((e) => (
                        <Link href={`/dashboard/${e.event_id}`} key={e.event_id}>
                            <EventCard 
                                event_title={e.event_title}
                                event_location={e.event_location}
                                start_date={e.event_start_date}
                                end_date={e.event_end_date}
                                event_description={e.event_description}
                                />
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    )
}
