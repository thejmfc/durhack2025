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

  // Editable state for each section
  const [timetable, setTimetable] = useState<any[]>([]);
  const [miniEvents, setMiniEvents] = useState<any[]>([]);
  const [prizes, setPrizes] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  // Form state for adding new entries
  const [newTimetable, setNewTimetable] = useState({ time: '', title: '', description: '' });
  const [newMiniEvent, setNewMiniEvent] = useState({ title: '', description: '', host: '' });
  const [newPrize, setNewPrize] = useState({ title: '', description: '', suppliedBy: '' });
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', host: '' });

  // Fetch all sections from Supabase
  useEffect(() => {
    if (!user || !params.event) return;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tt, me, pr, ch] = await Promise.all([
          supabase.from('timetable').select('*').eq('event_id', params.event),
          supabase.from('mini_events').select('*').eq('event_id', params.event),
          supabase.from('prizes').select('*').eq('event_id', params.event),
          supabase.from('challenges').select('*').eq('event_id', params.event),
        ]);
        if (tt.error) throw tt.error;
        if (me.error) throw me.error;
        if (pr.error) throw pr.error;
        if (ch.error) throw ch.error;
        setTimetable(tt.data ?? []);
        setMiniEvents(me.data ?? []);
        setPrizes(pr.data ?? []);
        setChallenges(ch.data ?? []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, params.event]);

  // Add entry handlers (Supabase insert)
  const handleAddTimetable = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!params.event) return;
    const { data, error } = await supabase.from('timetable').upsert({
      event_id: params.event,
      time: newTimetable.time,
      title: newTimetable.title,
      description: newTimetable.description
    }).select();
    if (error) setError(error.message);
    if (!error && data) setTimetable(prev => [...prev, ...data]);
    setNewTimetable({ time: '', title: '', description: '' });
  };
  const handleRemoveTimetable = async (idx: number) => {
    const entry = timetable[idx];
    if (!entry?.id) return;
    const { error } = await supabase.from('timetable').delete().eq('id', entry.id);
    if (!error) setTimetable(timetable.filter((_, i) => i !== idx));
  };
  const handleAddMiniEvent = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!params.event) return;
    const { data, error } = await supabase.from('mini_events').upsert({
      event_id: params.event,
      title: newMiniEvent.title,
      description: newMiniEvent.description,
      host: newMiniEvent.host
    }).select();
    if (error) setError(error.message);
    if (!error && data) setMiniEvents(prev => [...prev, ...data]);
    setNewMiniEvent({ title: '', description: '', host: '' });
  };
  const handleRemoveMiniEvent = async (idx: number) => {
    const entry = miniEvents[idx];
    if (!entry?.id) return;
    const { error } = await supabase.from('mini_events').delete().eq('id', entry.id);
    if (!error) setMiniEvents(miniEvents.filter((_, i) => i !== idx));
  };
  const handleAddPrize = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!params.event) return;
    const { data, error } = await supabase.from('prizes').upsert({
      event_id: params.event,
      title: newPrize.title,
      description: newPrize.description,
      supplied_by: newPrize.suppliedBy
    }).select();
    if (error) setError(error.message);
    if (!error && data) setPrizes(prev => [...prev, ...data]);
    setNewPrize({ title: '', description: '', suppliedBy: '' });
  };
  const handleRemovePrize = async (idx: number) => {
    const entry = prizes[idx];
    if (!entry?.id) return;
    const { error } = await supabase.from('prizes').delete().eq('id', entry.id);
    if (!error) setPrizes(prizes.filter((_, i) => i !== idx));
  };
  const handleAddChallenge = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!params.event) return;
    const { data, error } = await supabase.from('challenges').upsert({
      event_id: params.event,
      title: newChallenge.title,
      description: newChallenge.description,
      host: newChallenge.host
    }).select();
    if (error) setError(error.message);
    if (!error && data) setChallenges(prev => [...prev, ...data]);
    setNewChallenge({ title: '', description: '', host: '' });
  };
  const handleRemoveChallenge = async (idx: number) => {
    const entry = challenges[idx];
    if (!entry?.id) return;
    const { error } = await supabase.from('challenges').delete().eq('id', entry.id);
    if (!error) setChallenges(challenges.filter((_, i) => i !== idx));
  };

  return (
    <>
      <div><LogoutButton /></div>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar Navigation */}
        <DashboardSidebar uuid={params.event as string || ""} />
        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem" }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Hacker Experience
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <>
              {/* Timetable Section */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Full Timetable</h2>
                <form onSubmit={handleAddTimetable} style={{ display: 'flex', gap: 8, margin: '1rem 0' }}>
                  <input
                    required
                    type="time"
                    placeholder="Time"
                    value={newTimetable.time}
                    onChange={e => setNewTimetable({ ...newTimetable, time: e.target.value })}
                  />
                  <input required placeholder="Title" value={newTimetable.title} onChange={e => setNewTimetable({ ...newTimetable, title: e.target.value })} />
                  <input required placeholder="Description" value={newTimetable.description} onChange={e => setNewTimetable({ ...newTimetable, description: e.target.value })} />
                  <button type="submit">Add</button>
                </form>
                <ul>
                  {timetable.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <b>{entry.time}</b> - {entry.title}: {entry.description}
                      <button style={{ marginLeft: 8 }} onClick={() => handleRemoveTimetable(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mini Events Section */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Mini Events</h2>
                <form onSubmit={handleAddMiniEvent} style={{ display: 'flex', gap: 8, margin: '1rem 0' }}>
                  <input required placeholder="Title" value={newMiniEvent.title} onChange={e => setNewMiniEvent({ ...newMiniEvent, title: e.target.value })} />
                  <input required placeholder="Description" value={newMiniEvent.description} onChange={e => setNewMiniEvent({ ...newMiniEvent, description: e.target.value })} />
                  <input required placeholder="Host" value={newMiniEvent.host} onChange={e => setNewMiniEvent({ ...newMiniEvent, host: e.target.value })} />
                  <button type="submit">Add</button>
                </form>
                <ul>
                  {miniEvents.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <b>{entry.title}</b>: {entry.description} <i>(Host: {entry.host})</i>
                      <button style={{ marginLeft: 8 }} onClick={() => handleRemoveMiniEvent(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Prizes Section */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Prizes</h2>
                <form onSubmit={handleAddPrize} style={{ display: 'flex', gap: 8, margin: '1rem 0' }}>
                  <input required placeholder="Title" value={newPrize.title} onChange={e => setNewPrize({ ...newPrize, title: e.target.value })} />
                  <input required placeholder="Description" value={newPrize.description} onChange={e => setNewPrize({ ...newPrize, description: e.target.value })} />
                  <input required placeholder="Supplied By" value={newPrize.suppliedBy} onChange={e => setNewPrize({ ...newPrize, suppliedBy: e.target.value })} />
                  <button type="submit">Add</button>
                </form>
                <ul>
                  {prizes.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <b>{entry.title}</b>: {entry.description} <i>(Supplied by: {entry.supplied_by || entry.suppliedBy})</i>
                      <button style={{ marginLeft: 8 }} onClick={() => handleRemovePrize(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Challenges Section */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Challenges</h2>
                <form onSubmit={handleAddChallenge} style={{ display: 'flex', gap: 8, margin: '1rem 0' }}>
                  <input required placeholder="Title" value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} />
                  <input required placeholder="Description" value={newChallenge.description} onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} />
                  <input required placeholder="Host" value={newChallenge.host} onChange={e => setNewChallenge({ ...newChallenge, host: e.target.value })} />
                  <button type="submit">Add</button>
                </form>
                <ul>
                  {challenges.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      <b>{entry.title}</b>: {entry.description} <i>(Host: {entry.host})</i>
                      <button style={{ marginLeft: 8 }} onClick={() => handleRemoveChallenge(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
