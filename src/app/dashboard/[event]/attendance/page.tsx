"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

function AddAttendee({ eventId }: { eventId: string }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    phone_number: "",
    email_address: "",
    dietary_requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const mapped = results.data.map((row: any) => ({
          event_id: eventId,
          first_name: row.first_name || row["First Name"] || "",
          last_name: row.last_name || row["Last Name"] || "",
          age: row.age || row["Age"] || "",
          gender: row.gender || row["Gender"] || "",
          phone_number: row.phone_number || row["Phone Number"] || "",
          email_address: row.email_address || row["Email"] || row["Email Address"] || "",
          dietary_requirements: row.dietary_requirements || row["Dietary Requirements"] || "",
        }));
        const valid = mapped.filter(a => a.first_name && a.last_name && a.email_address);
        if (valid.length === 0) {
          setCsvError("No valid attendees found in CSV.");
          setCsvLoading(false);
          return;
        }
        const { error } = await supabase.from("attendees").insert(valid);
        if (error) {
          setCsvError(error.message);
        } else {
          window.location.reload();
        }
        setCsvLoading(false);
      },
      error: (err: any) => {
        setCsvError("Failed to parse CSV: " + err.message);
        setCsvLoading(false);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("attendees").insert([
      {
        event_id: eventId,
        ...form,
        age: Number(form.age),
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setForm({
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        phone_number: "",
        email_address: "",
        dietary_requirements: "",
      });
      window.location.reload();
    }

    setLoading(false);
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2">
        <label className="block font-medium mb-1">Upload CSV to add multiple attendees:</label>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleCSVUpload}
          className="block border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          disabled={csvLoading}
        />
        {csvLoading && <p className="text-sm text-blue-600 mt-1">Uploading and parsing CSV...</p>}
        {csvError && <p className="text-sm text-red-500 mt-1">{csvError}</p>}
        <p className="text-xs text-gray-500 mt-1">Columns: first_name, last_name, age, gender, phone_number, email_address, dietary_requirements</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-Binary">Non-Binary</option>
          <option value="Prefer Not To Say">Prefer Not To Say</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="email_address"
          type="email"
          placeholder="Email"
          value={form.email_address}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="dietary_requirements"
          placeholder="Dietary Requirements"
          value={form.dietary_requirements}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-6 py-3 font-semibold text-white rounded-lg shadow-lg bg-slate-900 hover:from-blue-600 hover:to-purple-700 transition"
      >
        {loading ? "Adding..." : "Add Attendee"}
      </button>
    </form>
  );
}

function AttendeeStats({ attendees }: { attendees: any[] }) {
  if (attendees.length === 0) {
    return <p className="text-gray-600 italic">No attendees have been added yet.</p>;
  }

  const ages = attendees.map(a => a.age).filter(a => typeof a === "number");
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const meanAge = (ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1);

  const genderCounts = attendees.reduce(
    (acc, a) => {
      const gender = a.gender || "Other";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalAttendees = attendees.length;
  const genderPercentages = Object.entries(genderCounts).map(
    ([gender, count]) => `${gender}: ${((count / totalAttendees) * 100).toFixed(1)}%`
  );

  const dietary = Array.from(new Set(attendees.map(a => a.dietary_requirements).filter(Boolean)));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg shadow-md bg-gradient-to-r from-blue-100 to-purple-100">
        <p className="text-lg font-semibold">Total Attendees: <span className="text-purple-700">{totalAttendees}</span></p>
        <p className="text-lg font-semibold">Age Range: <span className="text-purple-700">{minAge} - {maxAge}</span></p>
        <p className="text-lg font-semibold">Mean Age: <span className="text-purple-700">{meanAge}</span></p>
      </div>

      <div className="p-4 rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-lg font-semibold">Gender Distribution:</p>
        <p>{genderPercentages.join(", ")}</p>
      </div>

      <div className="p-4 rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-lg font-semibold">Dietary Requirements:</p>
        <p>{dietary.join(", ") || "None"}</p>
      </div>
    </div>
  );
}

export default function EventAttendees() {
  const { user } = useAuth();
  const { event } = useParams<{ event: string }>();

  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !event) return;

    const fetchAttendees = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("attendees")
        .select("*")
        .eq("event_id", event);

      if (error) {
        setError(error.message);
        setAttendees([]);
      } else {
        setAttendees(data ?? []);
      }

      setLoading(false);
    };

    fetchAttendees();
  }, [user, event]);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar uuid={event || ""} />
      <main className="flex-1 flex flex-col bg-gray-50">
        <h1 className="text-3xl font-bold m-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Attendees Statistics
        </h1>
        <section className="flex-1 p-8 space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-black">Add a New Attendee</h2>
            {event && <AddAttendee eventId={event} />}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-black">Event Statistics</h2>
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {error && (
              <p className="text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
                Error: {error}
              </p>
            )}
            {!loading && !error && <AttendeeStats attendees={attendees} />}
          </div>
        </section>
      </main>
    </div>
  );
}
