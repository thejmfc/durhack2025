interface EventCardProps {
    event_title?: string;
    event_location?: string;
    start_date?: string;
    end_date?: string;
    event_description?: string;
    event_image_url?: string;
}

export default function EventCard(
    {
        event_title = "The Hackathon",
        event_location = "Hylia, Hyrule",
        start_date = "The Big Bang",
        end_date = "Heat Death",
        event_description = "Add your hackathon description here...",
        event_image_url = ""
    }: EventCardProps) {
    const imageSrc =
        event_image_url && event_image_url.length > 0
            ? event_image_url
            : `https://placehold.co/500x350?text=${event_title}`;

    return (
        <div className="min-h-full rounded-3xl bg-slate-900/60 border border-white/10 shadow-xl overflow-hidden backdrop-blur-lg transition hover:scale-105 hover:shadow-2xl">
            <div className="bg-gradient-to-br from-indigo-600/60 to-purple-800/40">
                <img
                    src={imageSrc}
                    alt="Hackathon Logo"
                    className="object-cover w-full h-[220px] rounded-t-3xl opacity-90"
                />
            </div>
            <div className="p-6">
                <section className="flex justify-between items-start gap-2">
                    <h1
                        className="text-lg font-bold text-slate-100 bg-clip-text"
                        style={{fontFamily: "'Exo 2', 'Poppins', 'Manrope', sans-serif"}}
                    >
                        {event_title}
                    </h1>
                    <span className="bg-orange-500 text-slate-50 px-4 py-2 text-sm font-semibold rounded-full shadow-md">
            {event_location}
          </span>
                </section>
                <section className="mt-2">
                    <div className="flex items-center text-slate-400 mb-1">
                        <h3 className="text-xs">
                            From ({start_date}) to ({end_date})
                        </h3>
                    </div>
                    <p className="text-slate-200 text-sm">
                        {event_description}
                    </p>
                </section>
            </div>
        </div>
    );
}
