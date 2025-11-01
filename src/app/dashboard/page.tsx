"use client"
import { useAuth } from "@/context/AuthContext";
import EventCard from "../../components/event_card"
import supabase from "@/Supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (events.length === 0) return <p>No events found for this user.</p>;

    
    return (
        <section className="flex">
            {events.map((e) => (
                <EventCard 
                    event_title={e.event_title}
                    event_location={e.event_location}
                    start_date={e.event_start_date}
                    end_date={e.event_end_date}
                    event_description={e.event_description}
                />

            ))}
        </section>
    )
}