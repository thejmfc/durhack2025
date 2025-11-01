export default function SponsorCard({ 
  sponsor_name = "A Company", 
  sponsor_tier = "Custom",
  sponsor_amount = 0,
  sponsor_status = "Pending",
}) {
  return (
    <div className="max-w-1/3 bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6">
        <section className="flex justify-between items-start">
          <h1 className="text-xl font-bold text-gray-900">
            {sponsor_name}
          </h1>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-md font-semibold rounded-full shadow-md">
            {sponsor_tier}
          </span>
        </section>
        
        <section>
          <div className="flex items-center text-gray-600">
            <p className="text-sm">
              £{sponsor_amount}
            </p>
          </div>
          <p className="text-gray-700">
            {sponsor_status}
          </p>
        </section>
      </div>
    </div>
  );
}
