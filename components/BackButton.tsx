"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Goes back if there's history, otherwise home. */
export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className={className}
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
      Go back
    </button>
  );
}