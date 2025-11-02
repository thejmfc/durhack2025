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

    fetchOrganisers(params.event as string);
  }, [params.event as string]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={params.event as string || ""} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50">
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", marginLeft: "1rem", marginTop: "1rem" }}>
          Logistics
        </h1>

        <section className="flex-1 p-8 space-y-8">
          {/* Add Organiser Section */}

            <AddOrganiser uuid={params.event as string} />

          {/* Organisers List Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Current Organisers
              </h2>
              {loading && <p className="text-sm text-gray-500">Loading...</p>}
            </div>

            {error && (
              <p className="text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
                Error: {error}
              </p>
            )}

            {!loading && !error && organisers.length === 0 && (
              <p className="text-gray-600 italic">
                No organisers have been added yet.
              </p>
            )}

            {!loading && !error && organisers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organisers.map((e, idx) => (
                  <OrganiserCard
                    key={idx}
                    first_name={e.first_name}
                    last_name={e.last_name}
                    phone_number={e.phone_number}
                    email_address={e.email_address}
                    role={e.role}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
