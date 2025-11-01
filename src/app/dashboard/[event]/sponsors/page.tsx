"use client";
import AddSponsor from "@/components/addSponsor";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SponsorCard from "@/components/sponsor";

export default function EventSponsor() {
  const { user } = useAuth();
  const params = useParams();

  const [sponsors, setSponsorDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSponsors = async (uuid : string) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("sponsor")
        .select("*")
        .eq("event_id", uuid);

      if (error) {
        setError(error.message);
        setSponsorDetails([]);
      } else {
        setSponsorDetails(data ?? []);
      }

      setLoading(false);
    };

    fetchSponsors(params.event as string);
  }, [params.event as string]);

  return (
    <><div><LogoutButton /></div><div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={params.event as string || ""} />
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Logistics
        </h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && 
        <>
          <AddSponsor uuid={params.event as string}/>
          {sponsors.map((e) => (
            <SponsorCard 
              key={e}
              sponsor_name={e.sponsor_name}
              sponsor_tier={e.sponsor_tier}
              sponsor_amount={e.sponsor_amount}
              sponsor_status={e.sponsor_status}
            />
          ))}
        </>
        }
      </main>
    </div></>
  );
}
