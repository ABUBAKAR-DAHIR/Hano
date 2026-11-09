import clsx from "clsx";
import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";

/** Highlighted note inside a legal section. */
export default function Callout({ tone = "info", children }: { tone?: "info" | "warning"; children: ReactNode }) {
  const warn = tone === "warning";
  return (
    <div
      className={clsx(
        "mt-5 flex gap-3 rounded-2xl border p-4 text-[15px] leading-7",
        warn
          ? "border-[#F2B33D]/40 bg-[#F2B33D]/10 text-foreground"
          : "border-primary/20 bg-accent/60 text-foreground",
      )}
    >
      {warn ? (
        <AlertTriangle className="mt-1 size-5 flex-none text-[#B7791F] dark:text-[#F2B33D]" aria-hidden="true" />
      ) : (
        <Info className="mt-1 size-5 flex-none text-primary" aria-hidden="true" />
      )}
      <div className="[&_p]:!mt-0 [&_p]:!text-foreground">{children}</div>
    </div>
  );
}