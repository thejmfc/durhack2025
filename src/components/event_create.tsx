"use client";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { refresh } from "next/cache";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";

export default function EventCreate() { 
    const { user, session } = useAuth();
    const [ isLoading, setLoading ] = useState(true);
    const [ isError, setError ] = useState<string | null>(null);
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


    async function uploadImageToBucket(file: File): Promise<string | null> {
        // Only allow image file types
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed.");
            return null;
        }
        if (!user?.id) {
            setError("No user id, cannot upload image");
            return null;
        }
        setError(null);
        // Always use the 'events' bucket, upload to folder named after user id
        const bucket = "events";
        // Sanitize file name
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filePath = `${user.id}/${Date.now()}_${safeName}`;
        // Log file details for debugging
        console.log("Uploading file:", {
            name: file.name,
            type: file.type,
            size: file.size,
            filePath,
            bucket
        });
        setImageUploading(true);
        const { data, error } = await supabase.storage.from(bucket).upload(
            filePath,
            file,
            {
                upsert: true,
                contentType: file.type || "image/png"
            }
        );
        setImageUploading(false);
        // Log upload result
        console.log("Upload result:", { data, error });
        if (error) {
            setError("Image upload error: " + error.message);
            return null;
        }
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        console.log("Public URL result:", publicUrlData);
        return publicUrlData?.publicUrl || null;
    }

    async function handleEventCreate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        let imageUrl = eventDetails.event_image_url;
        try {
            if (imageFile) {
                setImageUploading(true);
                const uploadedUrl = await uploadImageToBucket(imageFile);
                setImageUploading(false);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    setError("Image upload failed. Please try again.");
                    setLoading(false);
                    return;
                }
            }
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
                        event_image_url: imageUrl,
                    },
                ])
                .select();
            if (error) {
                setError(error.message);
                return;
            }
            // Optionally update state with the new event image URL
            setEventDetails(prev => ({ ...prev, event_image_url: imageUrl }));
            console.log("Event created:", data);
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            // window.location.reload();
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
            <div onClick={() => setIsModalOpen(true)} className="fixed bottom-5 left-5 w-16 h-16 flex items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg hover:cursor-pointer">
                <IoIosAddCircle color="white" size={48} />
            </div>


            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-90vh overflow-y-auto">
                        <div className="bg-linear-to-r from-blue-500 to-purple-600 p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                                    <p className="text-blue-50 text-sm mt-1">Fill in the details below</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white hover:text-gray-200 hover:cursor-pointer transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <form className="p-8 space-y-6" onSubmit={handleEventCreate}>
                            <div>
                                <label htmlFor="input_title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Title
                                </label>
                                <input
                                    id="input_title"
                                    name="event_title"
                                    type="text"
                                    placeholder="Enter event name"
                                    value={eventDetails.event_title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="input_location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    id="input_location"
                                    name="event_location"
                                    type="text"
                                    placeholder="Where will it take place?"
                                    value={eventDetails.event_location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="input_start" className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        id="input_start"
                                        name="event_start_date"
                                        type="date"
                                        value={eventDetails.event_start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="input_end" className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        id="input_end"
                                        name="event_end_date"
                                        type="date"
                                        value={eventDetails.event_end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="input_desc" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="input_desc"
                                    name="event_description"
                                    rows={4}
                                    placeholder="Tell us more about your event"
                                    value={eventDetails.event_description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="input_image" className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Image
                                </label>
                                <input
                                    id="input_image"
                                    name="event_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                />
                                {imageUploading && <p className="text-blue-500 text-sm mt-2">Uploading image...</p>}
                                {imageFile && !imageUploading && <p className="text-green-600 text-xs mt-1">Selected: {imageFile.name}</p>}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 hover:cursor-pointer"
                                    disabled={imageUploading}
                                >
                                    {imageUploading ? "Uploading..." : "Create Event"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition hover:cursor-pointer"
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