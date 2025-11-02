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

    const fetchTech = async () => {
      setLoading(true);
      setError(null);
      // Try to fetch from 'tech' table first
      const { data: techData, error: techError } = await supabase
        .from("tech")
        .select("*")
        .eq("event_id", params.event)
        .single();

      if (techError && techError.code !== 'PGRST116') { // Not found is ok, other errors are not
        setError(techError.message);
        setLoading(false);
        return;
      }

      if (techData) {
        setEvent(techData);
        setLoading(false);
        return;
      }

      // If not found in 'tech', fallback to 'hackathons' for event info
      const { data: eventData, error: eventError } = await supabase
        .from("hackathons")
        .select("*")
        .eq("event_id", params.event)
        .single();

      if (eventError) setError(eventError.message);
      else setEvent(eventData ?? {});
      setLoading(false);
    };

    fetchTech();
  }, [user, params.event]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa' }}>
      {/* Sidebar Navigation */}
      <DashboardSidebar uuid={params.event as string || ""} />
      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <div style={{ position: 'absolute', top: 24, right: 24 }}><LogoutButton /></div>
        <div style={{ width: '100%', maxWidth: 520, background: 'white', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', margin: '2rem 0' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', letterSpacing: -1 }}>Tech Situation</h1>
          {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {!loading && !error && (
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                try {
                  const { error: insertError } = await supabase
                    .from('tech')
                    .upsert({
                      tech_screens: Number(event.tech_screens) || 0,
                      tech_sockets: Number(event.tech_sockets) || 0,
                      tech_extension_leads: Number(event.tech_extension_leads) || 0,
                      tech_extra_materials: event.tech_extra_materials || '',
                      event_id: params.event as string
                    })
                    .eq('event_id', params.event)
                    .single();
                  if (insertError) throw insertError;
                  setLoading(false);
                } catch (err: any) {
                  setError(err.message || 'Failed to save tech details');
                  setLoading(false);
                }
              }}
            >
              <div>
                <label htmlFor="screens" style={{ fontWeight: 'bold' }}>Available Screens</label>
                <input
                  id="screens"
                  type="number"
                  min={0}
                  value={event?.tech_screens ?? ''}
                  onChange={e => setEvent({ ...event, tech_screens: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', marginTop: 4, border: '1px solid #e0e0e0', borderRadius: 6 }}
                  placeholder="Number of screens available"
                  required
                />
              </div>
              <div>
                <label htmlFor="sockets" style={{ fontWeight: 'bold' }}>Available Sockets</label>
                <input
                  id="sockets"
                  type="number"
                  min={0}
                  value={event?.tech_sockets ?? ''}
                  onChange={e => setEvent({ ...event, tech_sockets: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', marginTop: 4, border: '1px solid #e0e0e0', borderRadius: 6 }}
                  placeholder="Number of sockets available"
                  required
                />
              </div>
              <div>
                <label htmlFor="extensionLeads" style={{ fontWeight: 'bold' }}>Extension Leads</label>
                <input
                  id="extensionLeads"
                  type="number"
                  min={0}
                  value={event?.tech_extension_leads ?? ''}
                  onChange={e => setEvent({ ...event, tech_extension_leads: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', marginTop: 4, border: '1px solid #e0e0e0', borderRadius: 6 }}
                  placeholder="Number of extension leads"
                  required
                />
              </div>
              <div>
                <label htmlFor="extraMaterials" style={{ fontWeight: 'bold' }}>Extra Materials</label>
                <textarea
                  id="extraMaterials"
                  value={event?.tech_extra_materials ?? ''}
                  onChange={e => setEvent({ ...event, tech_extra_materials: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', marginTop: 4, minHeight: 60, border: '1px solid #e0e0e0', borderRadius: 6 }}
                  placeholder="e.g. Raspberry Pis, Arduinos, sensors, etc."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#101727',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '0.9rem 1.5rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 8,
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                {loading ? 'Saving...' : 'Save Tech Details'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
