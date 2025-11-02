"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AddSponsor({ uuid } : {uuid : string}) {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sponsorDetails, setSponsorDetails] = useState({
    sponsor_name: "",
    sponsor_tier: "",
    sponsor_amount: 0,
    sponsor_status: "",
    event_id: "",
  });

  const [expenseDetails, setExpenseDetails] = useState({
    expense_title: "",
    expense_amount: 0,
    expense_type: "",
    expense_category: "",
    expense_date: new Date(),
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSponsorDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setExpenseDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  async function handleAddSponsor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("sponsor")
        .insert([
          {
            sponsor_name: sponsorDetails.sponsor_name,
            sponsor_tier: sponsorDetails.sponsor_tier,
            sponsor_amount: sponsorDetails.sponsor_amount,
            sponsor_status: sponsorDetails.sponsor_status,
            event_id: uuid,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Sponsor created:", data);
      router.refresh();
      
    } catch (err: any) {
      console.error("Error adding sponsor:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      if (!error) {window.location.reload()}
    }

    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            expense_title: sponsorDetails.sponsor_name + " Sponsorship",
            expense_amount: sponsorDetails.sponsor_amount,
            expense_type: "Income",
            expense_category: "Sponsorship",
            expense_date: new Date(),
            event_id: uuid,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Expense added:", data);
      router.refresh();
      
    } catch (err: any) {
      console.error("Error adding expense:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAddSponsor}
      className="mx-aut p-6 space-y-4"
    >

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="sponsor_name"
        placeholder="Sponsor Name"
        onChange={handleChange}
        value={sponsorDetails.sponsor_name}
        className="w-full border p-2 rounded"
        required
      />

    <select
      name="sponsor_tier"
      onChange={handleChange}
      value={sponsorDetails.sponsor_tier}
      className="w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    >
      <option value="">Select Sponsor Tier</option>
      <option value="Platinum">Platinum</option>
      <option value="Gold">Gold</option>
      <option value="Silver">Silver</option>
      <option value="Bronze">Bronze</option>
      <option value="Custom">Custom</option>
    </select>


      <input
        name="sponsor_amount"
        placeholder="Sponsor Amount"
        onChange={handleChange}
        value={sponsorDetails.sponsor_amount}
        className="w-full border p-2 rounded"
      />

      <input
        name="sponsor_status"
        placeholder="Sponsor Status"
        onChange={handleChange}
        value={sponsorDetails.sponsor_status}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700"
      >
        {isLoading ? "Adding..." : "Add Sponsor"}
      </button>
    </form>
  );
}
