"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventLogistics() {
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

  return (
    <><div><LogoutButton /></div><div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={params.event as string || ""} />
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && 
        <>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Sponsors
            </h1>
        </>
        }
      </main>
    </div></>
  );
}
