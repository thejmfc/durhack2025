"use client";
import supabase from "@/Supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBuilding({ uuid }: { uuid: string }) {
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
            const { data: buildingData, error: buildingError } = await supabase
                .from("buildings")
                .insert([
                    {
                        building_name: buildingDetails.building_name,
                        building_capacity: buildingDetails.building_capacity,
                        lecture_theatres: buildingDetails.lecture_theatres,
                        hacking_rooms: buildingDetails.hacking_rooms,
                        cost: buildingDetails.cost,
                        event_id: uuid,
                    },
                ])
                .select();

            if (buildingError) throw buildingError;
            console.log("Building created:", buildingData);

            const { data: expenseData, error: expenseError } = await supabase
                .from("expenses")
                .insert([
                    {
                        expense_title: buildingDetails.building_name + "Booking",
                        expense_amount: buildingDetails.cost,
                        expense_type: "Withdrawal",
                        expense_category: "Logistics",
                        expense_date: new Date(),
                        event_id: uuid,
                    },
                ])
                .select();

            if (expenseError) throw expenseError;
            console.log("Expense added:", expenseData);

            router.refresh();
        } catch (err: any) {
            console.error("Error:", err);
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
                className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-black"
            >
                {isLoading ? "Adding..." : "Add Building"}
            </button>
        </form>
    );
}
