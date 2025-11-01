"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ uuid }: { uuid: string }) {
  const pathname = usePathname();

  const items = [
    { name: "Overview", path: "" },
    { name: "Logistics", path: "logistics" },
    { name: "Finance", path: "finance" },
    { name: "Sponsors", path: "sponsors" },
    { name: "Tech", path: "tech" },
    { name: "Hacker Experience", path: "hacker-experience" },
  ];

  return (
    <nav className="w-56 bg-gray-900 text-white p-8 flex flex-col gap-8">
      <div className="font-bold text-2xl mb-8">HackSmith</div>

      <ul className="flex flex-col gap-3">
        {items.map(({ name, path }) => {
          const fullPath = path ? `/dashboard/${uuid}/${path}` : `/dashboard/${uuid}`;
          const normalizedPathname = pathname?.replace(/\/$/, "");
          const isActive = normalizedPathname === fullPath;

          return (
            <li key={name}>
              <Link
                href={fullPath}
                className={`block px-2 py-1 rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-700 font-semibold"
                    : "hover:bg-gray-800 font-normal"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
