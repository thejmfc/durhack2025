export default function BuildingCard({ 
  building_name = "John", 
  building_capacity = "1",
  lecture_theatres = "1",
  hacking_rooms = "1",
}) {
  return (
    <div className="max-w-2/3 bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6">
        <section className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-gray-900">
            {building_name}
          </h1>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-md font-semibold rounded-full shadow-md">
            Capacity: {building_capacity}
          </span>
        </section>
        
        <section>
          <div className="flex items-center text-gray-600">
            <p className="text-sm">
              Leacture Theatres: {lecture_theatres}
            </p>
          </div>
          <p className="text-gray-700">
            hacking_rooms: {hacking_rooms}
          </p>
        </section>
      </div>
    </div>
  );
}