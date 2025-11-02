import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";

export default function AddOrganiser({ uuid } : {uuid : string}) {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [organiserDetails, setOrganiserDetails] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email_address: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrganiserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleAddOrganiser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("organiser")
        .insert([
          {
            first_name: organiserDetails.first_name,
            last_name: organiserDetails.last_name,
            phone_number: organiserDetails.phone_number,
            email_address: organiserDetails.email_address,
            role: organiserDetails.role,
            event_id: uuid,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Organiser created:", data);
      
    } catch (err: any) {
      console.error("Error creating organiser:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      if (!error) {window.location.reload()}
    }
  }

  return (
    <form
      onSubmit={handleAddOrganiser}
      className="max-w-full mx-auto bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Add Organiser
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
        value={organiserDetails.first_name}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
        value={organiserDetails.last_name}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="phone_number"
        placeholder="Phone Number"
        onChange={handleChange}
        value={organiserDetails.phone_number}
        className="w-full border p-2 rounded"
      />

      <input
        name="email_address"
        placeholder="Email Address"
        onChange={handleChange}
        value={organiserDetails.email_address}
        className="w-full border p-2 rounded"
      />

      <input
        name="role"
        placeholder="Role"
        onChange={handleChange}
        value={organiserDetails.role}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-black"
      >
        {isLoading ? "Adding..." : "Add Organiser"}
      </button>
    </form>
  );
}
