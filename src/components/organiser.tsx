export default function OrganiserCard({ 
  first_name = "John", 
  last_name = "Doe",
  phone_number = "00000 000000",
  email_address = "johndoe@example.com",
  role = "Organiser"
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="p-6">
        <section className="flex justify-between items-center align-middle ">
          <h1 className="text-xl font-bold text-gray-900">
            {first_name} {last_name}
          </h1>
          <span className="bg-slate-900 text-white px-4 py-2 text-md font-semibold rounded-full shadow-md">
            {role}
          </span>
        </section>
        
        <section>
          <div className="flex items-center text-gray-600">
            <p className="text-sm">
              {phone_number}
            </p>
          </div>
          <p className="text-gray-700">
            {email_address}
          </p>
        </section>
      </div>
    </div>
  );
}
