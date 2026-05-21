"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type Status = "all" | "paid" | "pending" | "failed" | "expired" | "refunded" | "unknown";
type Source = "all" | "stripe" | "xendit";

interface Props {
  status: Status;
  source: Source;
  counts: { all: number; paid: number; pending: number; failed: number };
}

export function OrdersFilters({ status, source, counts }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(name: string, value: string) {
    const next = new URLSearchParams(params);
    if (value === "all") {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    const qs = next.toString();
    router.push(qs ? `/admin/orders?${qs}` : "/admin/orders");
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex flex-wrap gap-2">
        <FilterPill
          label={`All · ${counts.all}`}
          active={status === "all"}
          onClick={() => setParam("status", "all")}
        />
        <FilterPill
          label={`Paid · ${counts.paid}`}
          active={status === "paid"}
          onClick={() => setParam("status", "paid")}
        />
        <FilterPill
          label={`Pending · ${counts.pending}`}
          active={status === "pending"}
          onClick={() => setParam("status", "pending")}
        />
        <FilterPill
          label={`Failed · ${counts.failed}`}
          active={status === "failed"}
          onClick={() => setParam("status", "failed")}
        />
      </div>

      <div className="h-5 w-px bg-violet" />

      <div className="flex flex-wrap gap-2">
        <FilterPill
          label="All sources"
          active={source === "all"}
          onClick={() => setParam("source", "all")}
        />
        <FilterPill
          label="Stripe"
          active={source === "stripe"}
          onClick={() => setParam("source", "stripe")}
        />
        <FilterPill
          label="Xendit"
          active={source === "xendit"}
          onClick={() => setParam("source", "xendit")}
        />
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-[12px] uppercase tracking-[0.16em] transition-colors border",
        active
          ? "bg-gold text-midnight border-gold"
          : "text-cream-deep border-violet hover:border-gold hover:text-gold",
      )}
    >
      {label}
    </button>
  );
}
