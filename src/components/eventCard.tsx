export default function EventCard({
      event_title = "The Hackathon",
      event_location = "Hylia, Hyrule",
      start_date = "The Big Bang",
      end_date = "Heat Death",
      event_description = "Add your hackathon description here..."
  }) {
    return (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl shadow-xl overflow-hidden backdrop-blur-lg transition hover:scale-105 hover:shadow-2xl">
            {/* Glassy image container (slightly lighter gradient for accent) */}
            <div className="bg-gradient-to-br from-indigo-500/60 to-purple-700/40">
                <img src="https://placehold.co/500" alt="Hackathon Logo" className="w-full h-40 object-cover rounded-t-3xl opacity-90"/>
            </div>

            <div className="p-6">
                <section className="flex justify-between items-start gap-2">
                    <h1
                        className="text-lg font-bold text-slate-100 bg-clip-text"
                        style={{fontFamily: "'Exo 2', 'Poppins', 'Manrope', sans-serif"}}
                    >
                        {event_title}
                    </h1>
                    <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-orange-500 text-slate-50 px-4 py-2 text-sm font-semibold rounded-full shadow-md">
            {event_location}
          </span>
                </section>

                <section className="mt-2">
                    <div className="flex items-center text-slate-400 mb-1">
                        <h3 className="text-xs">
                            {start_date} – {end_date}
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
