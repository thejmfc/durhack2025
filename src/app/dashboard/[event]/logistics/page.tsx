"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import OrganiserCard from "@/components/organiser";
import AddOrganiser from "@/components/addOrganiser";
import BuildingCard from "@/components/room";
import AddBuilding from "@/components/addBuilding";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventLogistics() {
  const { user }: { user: any } = useAuth();
  const params: { event: string } = useParams();

  const [organisers, setOrganisers] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]); // renamed for consistency
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrganisers = async (uuid: string) => {
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

    if (typeof params.event === 'string') {
      fetchOrganisers(params.event);
    }
  }, [params.event, user]);

  useEffect(() => {
    if (!user) return;

    const fetchBuildings = async (uuid: string) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("buildings")
        .select("*")
        .eq("event_id", uuid);

      if (error) {
        setError(error.message);
        setBuildings([]);
      } else {
        setBuildings(data ?? []);
      }

      setLoading(false);
    };

    if (typeof params.event === 'string') {
      fetchBuildings(params.event);
    }
  }, [params.event, user]);

  return (
    <>
      <div><LogoutButton /></div>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <DashboardSidebar uuid={params.event as string || ""} />
        
        <main style={{ flex: 1, padding: "2rem" }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Logistics
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && 
            <>
              <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '2rem' }}>Organisers</h2>
                <AddOrganiser uuid={params.event as string}/>
                {organisers.map((e) => (
                  <OrganiserCard 
                    key={e.organiser_id} // Assuming 'id' is a unique identifier
                    first_name={e.first_name}
                    last_name={e.last_name}
                    phone_number={e.phone_number}
                    email_address={e.email_address}
                    role={e.role}
                  />
                ))}
              </section>

              <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '2rem' }}>Buildings</h2>
                <AddBuilding uuid={params.event as string}/>
                {buildings.map((building) => (
                  <BuildingCard 
                    key={building.building_id} // Assuming 'id' is a unique identifier
                    building_name={building.building_name}
                    building_capacity={building.building_capacity}
                    lecture_theatres={building.lecture_theatres}
                    hacking_rooms={building.hacking_rooms}
                    cost={building.cost}
                  />
                ))}
              </section>
            </>
          }
        </main>
      </div>
    </>
  );
}
