"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AddOrganiser({ uuid } : {uuid : string}) {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [buildingDetails, setBuildingDetails] = useState({
    building_name: "",
    building_capacity: "",
    lecture_theatres: "",
    hacking_rooms: "",
    cost: "",  
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuildingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleAddBuilding(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("building")
        .insert([
          {
            building_name: buildingDetails.building_name,
            building_capacity: buildingDetails.building_capacity,
            lecture_theatres: buildingDetails.lecture_theatres,
            hacking_rooms: buildingDetails.hacking_rooms,
            cost: buildingDetails.cost,
            building_id: uuid,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Organiser created:", data);

      router.refresh();
    } catch (err: any) {
      console.error("Error creating organiser:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAddBuilding}
      className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Add Building for Event: {uuid}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="building_name"
        placeholder="Building Name"
        onChange={handleChange}
        value={buildingDetails.building_name}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="building_capacity"
        placeholder="Building Capacity"
        onChange={handleChange}
        value={buildingDetails.building_capacity}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="lecture_theatres"
        placeholder="Lecture Theatres"
        onChange={handleChange}
        value={buildingDetails.lecture_theatres}
        className="w-full border p-2 rounded"
      />

      <input
        name="hacking_rooms"
        placeholder="Hacking Rooms"
        onChange={handleChange}
        value={buildingDetails.hacking_rooms}
        className="w-full border p-2 rounded"
      />

      <input
        name="cost"
        placeholder="Cost"
        onChange={handleChange}
        value={buildingDetails.cost}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700"
      >
        {isLoading ? "Adding..." : "Add Organiser"}
      </button>
    </form>
  );
}