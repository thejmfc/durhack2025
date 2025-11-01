"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    console.log(events)
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (events.length === 0) return <p>No events found for this user.</p>;

  return (
    <div>
      <h2>Events owned by {user?.email}</h2>
      <ul className="space-y-2">
        {events.map((e) => (
          <Link key={e} href={`/dashboard/${e.event_id}`}>{e.event_title}</Link>
        ))}
      </ul>
    </div>
  );
}
