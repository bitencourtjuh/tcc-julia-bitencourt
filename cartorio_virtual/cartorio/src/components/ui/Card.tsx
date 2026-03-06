import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type Variant = "white" | "green" | "amber" | "blue";

interface CardProps {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  variant?: Variant;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon: Icon,
  children,
  variant = "white",
}) => {
  const variants: Record<Variant, string> = {
    white: "bg-white border-gray-200",
    green: "bg-emerald-50/50 border-emerald-100",
    amber: "bg-amber-50/50 border-amber-100",
    blue: "bg-blue-50/50 border-blue-100",
  };

  return (
    <div
      className={`p-5 rounded-xl border shadow-sm ${variants[variant]} transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600 border border-gray-100">
            <Icon size={20} />
          </div>
        )}

        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>

      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
};