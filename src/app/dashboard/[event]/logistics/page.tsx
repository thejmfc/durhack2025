"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import OrganiserCard from "@/components/organiser";
import AddOrganiser from "@/components/addOrganiser";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventLogistics() {
  const { user } = useAuth();
  const params = useParams();

  const [organisers, setOrganisers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrganisers = async (uuid : string) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("organiser")
        .select("*")
        .eq("event_id", uuid);

      if (error) {
        setError(error.message);
        setOrganisers([]);
      } else {
        setOrganisers(data ?? []);
      }

      setLoading(false);
    };

    fetchOrganisers(params.event as string);
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
        <div className="flex w-full">
            <div className="w-full flex flex-col gap-2">

                {organisers.map((e) => (
                    <OrganiserCard 
                    key={e}
                    first_name={e.first_name}
                    last_name={e.last_name}
                    phone_number={e.phone_number}
                    email_address={e.email_address}
                    role={e.role}
                    />
                    ))
                }
            </div>
            <div className="w-full">

                <AddOrganiser uuid={params.event as string}/>
            </div>
        </div>
        }
      </main>
    </div></>
  );
}
