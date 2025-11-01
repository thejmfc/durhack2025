"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventInspect() {
  const { user } = useAuth();
  const params = useParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .eq("event_id", params.event)
        .single();

      if (error) setError(error.message);
      else setEvent(data ?? []);
      setLoading(false);
    };

    fetchEvent();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (event.length === 0) return <p>That event does not exist</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <nav
      style={{
        width: "220px",
        background: "#1a202c",
        color: "#fff",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
      >
      <div style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "2rem" }}>
        HackSmith
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Overview</a>
        </li>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Logistics</a>
        </li>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Finance</a>
        </li>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Sponsors</a>
        </li>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Tech</a>
        </li>
        <li>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Hacker Experience</a>
        </li>
      </ul>
      </nav>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
      <p>{event.event_title}</p>
      </main>
    </div>
  );
}
