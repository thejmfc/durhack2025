export default function EventCard({ 
  event_title = "The Hackathon", 
  event_location = "Hylia, Hyrule",
  start_date = "The Big Bang",
  end_date = "Heat Death",
  event_description = "Add your hackathon description here..."
}) {
  return (
    <div className="min-h-full bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600">
        <img src="https://placehold.co/500" alt="Hackathon Logo" className="w-full h-full object-cover"/>
      </div>
      
      <div className="p-6">
        <section className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-gray-900">
            {event_title}
          </h1>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-md font-semibold rounded-full shadow-md">
            {event_location}
          </span>
        </section>
        
        <section>
          <div className="flex items-center text-gray-600">
            <h3 className="text-sm">
              {start_date} - {end_date}
            </h3>
          </div>
          <p className="text-gray-700">
            {event_description}
          </p>
        </section>
      </div>
    </div>
  );
}
