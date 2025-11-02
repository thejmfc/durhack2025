"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatToggle from "@/components/chattoggle";
import OverviewCard from "@/components/overviewCard";

export default function EventInspect() {
  const { user } = useAuth();
  const params = useParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Overview data
  const [finances, setFinances] = useState<{ totalFunds: number, income: number, withdrawal: number }>({ totalFunds: 0, income: 0, withdrawal: 0 });
  const [sponsorCount, setSponsorCount] = useState<number>(0);
  const [sponsorTiers, setSponsorTiers] = useState<Record<string, number>>({});
  const [organiserCount, setOrganiserCount] = useState<number>(0);
  const [hackerCount, setHackerCount] = useState<number>(0);
  const [hackerStats, setHackerStats] = useState<{ timetable: number, miniEvents: number, prizes: number, challenges: number }>({ timetable: 0, miniEvents: 0, prizes: 0, challenges: 0 });
  const [techStatus, setTechStatus] = useState<string>("N/A");
  const [techDetails, setTechDetails] = useState<{ screens: number, sockets: number, leads: number, wifi: boolean }>({ screens: 0, sockets: 0, leads: 0, wifi: false });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const fetchAll = async () => {
      try {
        // Fetch event base info
        const { data: eventData, error: eventError } = await supabase
          .from("hackathons")
          .select("*")
          .eq("event_id", params.event)
          .single();
        if (eventError) throw eventError;
        setEvent(eventData ?? {});

        // Finances: sum incomes - withdrawals
        const { data: expenses, error: expError } = await supabase
          .from("expenses")
          .select("*")
          .eq("event_id", params.event);
        if (expError) throw expError;
        let totalFunds = 0, incomeSum = 0, withdrawalSum = 0;
        if (expenses && Array.isArray(expenses)) {
          const incomes = expenses.filter(e => (e.expense_type || '').toLowerCase() === 'income');
          const withdrawals = expenses.filter(e => (e.expense_type || '').toLowerCase() === 'withdrawal');
          incomeSum = incomes.reduce((sum, e) => sum + Number(e.expense_amount || 0), 0);
          withdrawalSum = withdrawals.reduce((sum, e) => sum + Number(e.expense_amount || 0), 0);
          totalFunds = incomeSum - withdrawalSum;
        }
        setFinances({ totalFunds, income: incomeSum, withdrawal: withdrawalSum });

        // Sponsors
        const { data: sponsors, error: sponsorError } = await supabase
          .from("sponsor")
          .select("sponsor_id")
          .eq("event_id", params.event);
        if (sponsorError) throw sponsorError;
        setSponsorCount(sponsors ? sponsors.length : 0);
        // Sponsor tiers breakdown
        const tiers = ["Platinum", "Gold", "Silver", "Bronze", "Custom"];
        const tierCounts: Record<string, number> = {};
        tiers.forEach(tier => {
          tierCounts[tier] = sponsors ? sponsors.filter((s: any) => s.sponsor_tier === tier).length : 0;
        });
        setSponsorTiers(tierCounts);

        // Organisers
        const { data: organisers, error: organiserError } = await supabase
          .from("organiser")
          .select("organiser_id")
          .eq("event_id", params.event);
        if (organiserError) throw organiserError;
        setOrganiserCount(organisers ? organisers.length : 0);

        // Hackers: count from timetable, mini_events, prizes, challenges (sum all rows as a proxy for activity)
        let hackerSum = 0;
        const [tt, me, pr, ch] = await Promise.all([
          supabase.from('timetable').select('id').eq('event_id', params.event),
          supabase.from('mini_events').select('id').eq('event_id', params.event),
          supabase.from('prizes').select('id').eq('event_id', params.event),
          supabase.from('challenges').select('id').eq('event_id', params.event),
        ]);
        if (tt.error) throw tt.error;
        if (me.error) throw me.error;
        if (pr.error) throw pr.error;
        if (ch.error) throw ch.error;
  const timetableCount = tt.data?.length || 0;
  const miniEventsCount = me.data?.length || 0;
  const prizesCount = pr.data?.length || 0;
  const challengesCount = ch.data?.length || 0;
  hackerSum = timetableCount + miniEventsCount + prizesCount + challengesCount;
  setHackerCount(hackerSum);
  setHackerStats({ timetable: timetableCount, miniEvents: miniEventsCount, prizes: prizesCount, challenges: challengesCount });

        // Tech status: try to get from tech table, fallback to event
        const { data: techData, error: techError } = await supabase
          .from("tech")
          .select("*")
          .eq("event_id", params.event)
          .single();
        if (techError && techError.code !== 'PGRST116') throw techError;
        if (techData) {
          const screens = techData.tech_screens || 0;
          const sockets = techData.tech_sockets || 0;
          const leads = techData.tech_extension_leads || 0;
          const wifi = !!techData.tech_wifi;
          setTechDetails({ screens, sockets, leads, wifi });
          let summary = `${screens} screens, ${sockets} sockets, ${leads} leads`;
          if (wifi) summary += ', WiFi';
          setTechStatus(summary);
        } else if (eventData && eventData.tech_status) {
          setTechStatus(eventData.tech_status);
        } else {
          setTechStatus('N/A');
        }

      } catch (err: any) {
        setError(err.message || 'Failed to fetch event data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, params.event]);

  return (
    <>
      <div><LogoutButton /></div>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <DashboardSidebar uuid={params.event as string || ""} />
        {/* Main Content */}
        <main className="flex-1 p-8">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <>
              <h1 className="text-3xl font-bold mb-4">Welcome to {event.event_title}</h1>
              {/* Stylised Event Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12 mt-8">
                <OverviewCard
                  title="Finances"
                  value={finances.totalFunds ? `£${finances.totalFunds}` : 'N/A'}
                  description="Total funds available"
                  stats={[`Income: £${finances.income}`, `Expenses: £${finances.withdrawal}`]}
                  href={`./${params.event}/finance`}
                  className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200 text-lg min-h-[200px]"
                />
                <OverviewCard
                  title="Sponsors"
                  value={sponsorCount}
                  description="Active sponsors"
                  stats={Object.entries(sponsorTiers).map(([tier, count]) => `${tier}: ${count}`)}
                  href={`./${params.event}/sponsors`}
                  className="bg-linear-to-br from-green-50 to-green-100 border-green-200 text-lg min-h-[200px]"
                />
                <OverviewCard
                  title="Organisers"
                  value={organiserCount}
                  description="Team members"
                  stats={organiserCount > 0 ? [organiserCount + ' organisers'] : []}
                  href={`./${params.event}/logistics`}
                  className="bg-linear-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-lg min-h-[200px]"
                />
                <OverviewCard
                  title="Hacker Activity"
                  value={hackerCount}
                  description="Activity items"
                  stats={[`Timetable: ${hackerStats.timetable}`, `Mini-events: ${hackerStats.miniEvents}`, `Prizes: ${hackerStats.prizes}`, `Challenges: ${hackerStats.challenges}`]}
                  href={`./${params.event}/hacker-experience`}
                  className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200 text-lg min-h-[200px]"
                />
                <OverviewCard
                  title="Tech Overview"
                  value={techStatus}
                  description="Tech readiness"
                  stats={[`${techDetails.screens} screens`, `${techDetails.sockets} sockets`, `${techDetails.leads} leads`, techDetails.wifi ? 'WiFi' : 'No WiFi']}
                  href={`./${params.event}/tech`}
                  className="bg-linear-to-br from-gray-50 to-gray-100 border-gray-200 text-lg min-h-[200px]"
                />
              </div>
            </>
          )}
      </main>
      {/* Floating AI chat assistant scoped to this event */}
      <ChatToggle eventId={params.event as string} />
    </div></>
  );
}
