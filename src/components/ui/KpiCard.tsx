import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string | number;
  badge?: string;
  valueClassName?: string;
  badgeClassName?: string;
  children?: ReactNode;
};

export function KpiCard({
  title,
  value,
  badge,
  valueClassName,
  badgeClassName,
  children,
}: KpiCardProps) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <p className={cn("text-3xl font-black text-slate-900", valueClassName)}>
          {value}
        </p>

        {badge && (
          <span
            className={cn(
              "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600",
              badgeClassName,
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
