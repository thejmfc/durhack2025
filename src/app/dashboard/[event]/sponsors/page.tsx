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

  const tiers = ["Platinum", "Gold", "Silver", "Bronze", "Custom"];
  const groupedSponsors: Record<string, any[]> = {};

  tiers.forEach((tier) => {
    groupedSponsors[tier] = sponsors.filter(
      (sponsor) => sponsor.sponsor_tier === tier
    );
  });

  const uncategorized = sponsors.filter(
    (sponsor) => !tiers.includes(sponsor.sponsor_tier)
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={event || ""} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50">
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Sponsors
        </h1>

        {/* Page content */}
        <section className="flex-1 p-8 space-y-8">
          {/* Add Sponsor Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add a New Sponsor
            </h2>
            <AddSponsor uuid={event} />
          </div>

          {/* Sponsor Sections by Tier */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-8">
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
              <>
                {tiers.map(
                  (tier) =>
                    groupedSponsors[tier].length > 0 && (
                      <div key={tier}>
                        <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-1">
                          {tier} Sponsors
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedSponsors[tier].map((sponsor, idx) => (
                            <SponsorCard
                              key={idx}
                              sponsor_name={sponsor.sponsor_name}
                              sponsor_tier={sponsor.sponsor_tier}
                              sponsor_amount={sponsor.sponsor_amount}
                              sponsor_status={sponsor.sponsor_status}
                            />
                          ))}
                        </div>
                      </div>
                    )
                )}

                {uncategorized.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-1">
                      Uncategorized Sponsors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uncategorized.map((sponsor) => (
                        <SponsorCard
                          key={sponsor.id}
                          sponsor_name={sponsor.sponsor_name}
                          sponsor_tier={sponsor.sponsor_tier}
                          sponsor_amount={sponsor.sponsor_amount}
                          sponsor_status={sponsor.sponsor_status}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
