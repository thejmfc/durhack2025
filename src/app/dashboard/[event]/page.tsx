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
  const [activePage, setActivePage] = useState("overview");

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

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <p>Overview content for {event.event_title}</p>;
      case "logistics":
        return <p>Logistics content for {event.event_title}</p>;
      case "finance":
        return <p>Finance content for {event.event_title}</p>;
      case "sponsors":
        return <p>Sponsors content for {event.event_title}</p>;
      case "tech":
        return <p>Tech content for {event.event_title}</p>;
      case "hacker-experience":
        return <p>Hacker Experience content for {event.event_title}</p>;
      default:
        return <p>Select a page from the sidebar.</p>;
    }
  };

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

        {(() => {
          const items = [
            "Overview",
            "Logistics",
            "Finance",
            "Sponsors",
            "Tech",
            "Hacker Experience",
          ];

          return (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {items.map((name) => {
                const slug = name.toLowerCase().replace(/\s+/g, "-");
                const isActive = slug === activePage;
                return (
                  <li key={slug}>
                    <button
                      onClick={() => setActivePage(slug)}
                      style={{
                        display: "block",
                        padding: "0.35rem 0.5rem",
                        borderRadius: 6,
                        color: "#fff",
                        background: isActive ? "#2d3748" : "transparent",
                        fontWeight: isActive ? 600 : 400,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>
          );
        })()}
      </nav>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome to {event.event_title}
        </h1>
        {renderContent()}
      </main>
    </div>
  );
}
