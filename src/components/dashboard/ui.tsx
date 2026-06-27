import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="heading-display text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-smoke">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-smoke">{label}</p>
      <p className="heading-display mt-2 text-3xl text-chalk">{value}</p>
      {hint && <p className="mt-1 text-xs text-smoke">{hint}</p>}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-12 text-center text-smoke">
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "muted" | "alert";
}) {
  const tones = {
    neutral: "bg-white/10 text-chalk",
    ok: "bg-white/15 text-chalk",
    muted: "bg-ash/40 text-smoke",
    alert: "bg-blood/80 text-chalk",
  };
  return <span className={cn("badge", tones[tone])}>{children}</span>;
}
