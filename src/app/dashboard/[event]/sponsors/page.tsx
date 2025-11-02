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
  const { event } = useParams<{ event: string }>();

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !event) return;

    const fetchSponsors = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("sponsor")
        .select("*")
        .eq("event_id", event);

      if (error) {
        setError(error.message);
        setSponsors([]);
      } else {
        setSponsors(data ?? []);
      }

      setLoading(false);
    };

    fetchSponsors();
  }, [user, event]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={event || ""} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* Top bar */}
        <header className="flex justify-between items-center border-b bg-white px-8 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Sponsorship</h1>
          <LogoutButton />
        </header>

        {/* Page content */}
        <section className="flex-1 p-8 space-y-8">
          {/* Add Sponsor Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add a New Sponsor
            </h2>
            <AddSponsor uuid={event} />
          </div>

          {/* Sponsor List */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Current Sponsors
              </h2>
              {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
            </div>

            {error && (
              <p className="text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
                Error: {error}
              </p>
            )}

            {!isLoading && !error && sponsors.length === 0 && (
              <p className="text-gray-600 italic">
                No sponsors have been added yet.
              </p>
            )}

            {!isLoading && !error && sponsors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor_name={sponsor.sponsor_name}
                    sponsor_tier={sponsor.sponsor_tier}
                    sponsor_amount={sponsor.sponsor_amount}
                    sponsor_status={sponsor.sponsor_status}
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
