"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();

  const [event, setEvent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("event_owner", user.id);

      if (error) setError(error.message);
      else setEvent(data ?? []);
      setLoading(false);
    };

    fetchEvent();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (event.length === 0) return <p>No events found for this user.</p>;

  return (
    <div>
      <h2>Events owned by {user?.email}</h2>
      <ul className="space-y-2">
        {event.map((e) => (
          <li key={e.id} className="border p-2 rounded">
            <h3 className="font-bold">{e.name}</h3>
            <p>{e.description}</p>
            <p>Date: {e.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
