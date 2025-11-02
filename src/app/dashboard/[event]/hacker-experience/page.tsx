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
      <LogoutButton />
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <DashboardSidebar uuid={params.event as string || ""} />
        {/* Main Content */}
        <main className="flex-1 px-4 py-10 md:px-10 max-w-4xl mx-auto w-full">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">Hacker Experience</h1>
          {loading && <p className="text-gray-500 text-lg">Loading...</p>}
          {error && <p className="text-red-700 font-semibold mb-4">{error}</p>}
          {!loading && !error && (
            <>
              {/* Timetable Section */}
              <section className="mb-10 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-2">Full Timetable</h2>
                <form onSubmit={handleAddTimetable} className="flex flex-row gap-4 my-4 w-full">
                  <input
                    required
                    type="time"
                    placeholder="Time"
                    value={newTimetable.time}
                    onChange={e => setNewTimetable({ ...newTimetable, time: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-base"
                  />
                  <input required placeholder="Title" value={newTimetable.title} onChange={e => setNewTimetable({ ...newTimetable, title: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Description" value={newTimetable.description} onChange={e => setNewTimetable({ ...newTimetable, description: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <button type="submit" className="bg-blue-600 text-white rounded-lg px-8 py-2 font-semibold hover:bg-blue-700 transition min-w-[90px]">Add</button>
                </form>
                <ul className="mt-2">
                  {timetable.map((entry, idx) => (
                    <li key={idx} className="mb-2 flex items-center justify-between text-base">
                      <span><b className="text-blue-600">{entry.time}</b> - <span className="font-semibold">{entry.title}</span>: {entry.description}</span>
                      <button onClick={() => handleRemoveTimetable(idx)} className="ml-4 bg-red-100 text-red-700 border-0 rounded-md px-4 py-1.5 font-medium hover:bg-red-200 transition">Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Mini Events Section */}
              <section className="mb-10 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-fuchsia-700 mb-2">Mini Events</h2>
                <form onSubmit={handleAddMiniEvent} className="flex flex-row gap-4 my-4 w-full">
                  <input required placeholder="Title" value={newMiniEvent.title} onChange={e => setNewMiniEvent({ ...newMiniEvent, title: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Description" value={newMiniEvent.description} onChange={e => setNewMiniEvent({ ...newMiniEvent, description: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Host" value={newMiniEvent.host} onChange={e => setNewMiniEvent({ ...newMiniEvent, host: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-base" />
                  <button type="submit" className="bg-fuchsia-700 text-white rounded-lg px-8 py-2 font-semibold hover:bg-fuchsia-800 transition min-w-[90px]">Add</button>
                </form>
                <ul className="mt-2">
                  {miniEvents.map((entry, idx) => (
                    <li key={idx} className="mb-2 flex items-center justify-between text-base">
                      <span><b className="text-fuchsia-700">{entry.title}</b>: {entry.description} <i className="text-gray-500">(Host: {entry.host})</i></span>
                      <button onClick={() => handleRemoveMiniEvent(idx)} className="ml-4 bg-red-100 text-red-700 border-0 rounded-md px-4 py-1.5 font-medium hover:bg-red-200 transition">Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Prizes Section */}
              <section className="mb-10 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-amber-700 mb-2">Prizes</h2>
                <form onSubmit={handleAddPrize} className="flex flex-row gap-4 my-4 w-full">
                  <input required placeholder="Title" value={newPrize.title} onChange={e => setNewPrize({ ...newPrize, title: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Description" value={newPrize.description} onChange={e => setNewPrize({ ...newPrize, description: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Supplied By" value={newPrize.suppliedBy} onChange={e => setNewPrize({ ...newPrize, suppliedBy: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-base" />
                  <button type="submit" className="bg-amber-700 text-white rounded-lg px-8 py-2 font-semibold hover:bg-amber-800 transition min-w-[90px]">Add</button>
                </form>
                <ul className="mt-2">
                  {prizes.map((entry, idx) => (
                    <li key={idx} className="mb-2 flex items-center justify-between text-base">
                      <span><b className="text-amber-700">{entry.title}</b>: {entry.description} <i className="text-gray-500">(Supplied by: {entry.supplied_by || entry.suppliedBy})</i></span>
                      <button onClick={() => handleRemovePrize(idx)} className="ml-4 bg-red-100 text-red-700 border-0 rounded-md px-4 py-1.5 font-medium hover:bg-red-200 transition">Remove</button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Challenges Section */}
              <section className="mb-10 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-green-700 mb-2">Challenges</h2>
                <form onSubmit={handleAddChallenge} className="flex flex-row gap-4 my-4 w-full">
                  <input required placeholder="Title" value={newChallenge.title} onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Description" value={newChallenge.description} onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 text-base" />
                  <input required placeholder="Host" value={newChallenge.host} onChange={e => setNewChallenge({ ...newChallenge, host: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 w-32 text-base" />
                  <button type="submit" className="bg-green-700 text-white rounded-lg px-8 py-2 font-semibold hover:bg-green-800 transition min-w-[90px]">Add</button>
                </form>
                <ul className="mt-2">
                  {challenges.map((entry, idx) => (
                    <li key={idx} className="mb-2 flex items-center justify-between text-base">
                      <span><b className="text-green-700">{entry.title}</b>: {entry.description} <i className="text-gray-500">(Host: {entry.host})</i></span>
                      <button onClick={() => handleRemoveChallenge(idx)} className="ml-4 bg-red-100 text-red-700 border-0 rounded-md px-4 py-1.5 font-medium hover:bg-red-200 transition">Remove</button>
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
