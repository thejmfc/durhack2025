import Link from "next/link";
import React from "react";


interface OverviewCardProps {
  title: string;
  value: string | number;
  description: string;
  href: string;
  className?: string;
  stats?: string[];
}


const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, description, href, className, stats }) => (
  <div className={`rounded-2xl shadow-lg p-8 flex flex-col items-start min-h-[200px] border transition-shadow hover:shadow-2xl ${className || ''}`}>
    <span className="text-xl font-bold mb-2 text-gray-800">{title}</span>
    <span className="text-3xl font-extrabold mb-2 text-gray-900">{value}</span>
    <span className="text-base text-gray-600 mb-3">{description}</span>
    {stats && stats.length > 0 && (
      <ul className="mb-3 text-gray-700 text-base space-y-1">
        {stats.map((s, i) => <li key={i}>• {s}</li>)}
      </ul>
    )}
    <Link href={href} className="mt-auto text-blue-600 font-semibold text-base hover:underline">
      View details →
    </Link>
  </div>
);

export default OverviewCard;
