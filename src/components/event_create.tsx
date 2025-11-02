"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";

export default function EventCreate() {
    const { user } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const [eventDetails, setEventDetails] = useState({
        event_title: "",
        event_location: "",
        event_start_date: "",
        event_end_date: "",
        event_description: "",
        event_image_url: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    // image upload logic (unchanged)

    async function handleEventCreate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("hackathons")
                .insert([
                    {
                        event_title: eventDetails.event_title,
                        event_location: eventDetails.event_location,
                        event_start_date: eventDetails.event_start_date,
                        event_end_date: eventDetails.event_end_date,
                        event_description: eventDetails.event_description,
                        event_owner: user?.id,
                        event_image_url: eventDetails.event_image_url,
                    },
                ])
                .select();
            if (error) {
                setError(error.message);
                return;
            }
            setEventDetails(prev => ({ ...prev, event_image_url: eventDetails.event_image_url }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            if (!error) {window.location.reload()}
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEventDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <>
            {/* Floating glassmorphic "+" */}
            <div
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-5 left-5 w-16 h-16 flex items-center justify-center rounded-full
                  bg-slate-900/80 shadow-xl border border-white/10 hover:bg-orange-500 hover:shadow-orange-400/30 transition backdrop-blur-lg"
            >
                <IoIosAddCircle color="white" size={48} />
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900/80 rounded-3xl shadow-2xl border border-white/10
                        overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto relative backdrop-blur-lg"
                    >
                        {/* Head bar, no gradient */}
                        <div className="px-7 py-6 border-b border-white/10 bg-slate-900/70">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-orange-400 tracking-tight drop-shadow">Create New Event</h2>
                                    <p className="text-slate-300 text-sm mt-1">Fill in the details below</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-orange-500 hover:text-orange-300 hover:cursor-pointer transition"
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form className="p-8 space-y-6" onSubmit={handleEventCreate}>
                            <div>
                                <label htmlFor="input_title" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Event Title
                                </label>
                                <input
                                    id="input_title"
                                    name="event_title"
                                    type="text"
                                    placeholder="Enter event name"
                                    value={eventDetails.event_title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="input_location" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Location
                                </label>
                                <input
                                    id="input_location"
                                    name="event_location"
                                    type="text"
                                    placeholder="Where will it take place?"
                                    value={eventDetails.event_location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="input_start" className="block text-sm font-semibold text-slate-200 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        id="input_start"
                                        name="event_start_date"
                                        type="date"
                                        value={eventDetails.event_start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="input_end" className="block text-sm font-semibold text-slate-200 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        id="input_end"
                                        name="event_end_date"
                                        type="date"
                                        value={eventDetails.event_end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="input_desc" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="input_desc"
                                    name="event_description"
                                    rows={4}
                                    placeholder="Tell us more about your event"
                                    value={eventDetails.event_description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="input_image" className="block text-sm font-semibold text-slate-200 mb-2">
                                    Event Image
                                </label>
                                <input
                                    id="input_image"
                                    name="event_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 rounded-lg border border-white/10 bg-slate-900/40 text-slate-100 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none"
                                />
                                {imageUploading && <p className="text-orange-400 text-sm mt-2">Uploading image...</p>}
                                {imageFile && !imageUploading && <p className="text-green-400 text-xs mt-1">Selected: {imageFile.name}</p>}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:ring-2 focus:ring-orange-400 border border-orange-400 transition duration-200"
                                    disabled={imageUploading}
                                >
                                    {imageUploading ? "Uploading..." : "Create Event"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 border-2 border-white/10 text-slate-200 font-semibold rounded-lg bg-slate-900/40 hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
