import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-1">
      {title.includes("Revenue")
        ? `₹${value.toLocaleString()}`
        : value.toLocaleString()}
    </p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);
