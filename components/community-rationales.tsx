// app/gov-actions/[id]/rationales-page/public-rationales.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Vote } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { VoteChoice } from "@prisma/client"; // enum values (YES/NO/ABSTAIN)
import type { VoteChoice as VoteChoiceType } from "@prisma/client"; // type for TS

type RationaleItem = { choice: VoteChoiceType; rationale: string | null };

export default function PublicRationales() {
  const [rationales, setRationales] = useState<RationaleItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Choice color for the titles
  const choiceColor: Record<VoteChoiceType, string> = {
    YES: "text-green-600",
    NO: "text-red-600",
    ABSTAIN: "text-black", // or "text-foreground"
  };

  // Extract govActionId from the URL: /gov-actions/<id>/rationales-page
  const pathname = usePathname();
  const parts = pathname.split("/");
  const rawId = parts[parts.length - 2];
  const govActionId = decodeURIComponent(rawId);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(
          `/api/gov-actions/${encodeURIComponent(govActionId)}/rationales`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: { rationales: RationaleItem[] } = await res.json();
        if (!cancelled) setRationales(data.rationales);
      } catch (e) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (govActionId) run();
    return () => {
      cancelled = true;
    };
  }, [govActionId]);

  // Simple states
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading rationales…</CardContent>
      </Card>
    );
  }

  if (err) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-4">
        <Card>
          <CardContent className="p-6 text-red-600">
            Failed to load rationales: {err}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rationales || rationales.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-4">
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No rationales yet.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Choice label (optional—makes titles friendlier)
  const label = (c: VoteChoiceType) =>
    c === VoteChoice.YES ? "Yes" : c === VoteChoice.NO ? "No" : "Abstain";

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-4">
      {rationales.map((item, idx) => (
        <Card
          key={idx}
          className="py-0 gap-0 overflow-hidden hover:shadow-sm transition-shadow"
        >
          <CardHeader className="bg-muted/60 border-b px-6 py-2 items-center [.border-b]:pb-1">
            <CardTitle
              className={`flex items-center gap-2 text-sm font-semibold leading-tight ${
                choiceColor[item.choice]
              }`}
            >
              <Vote className="h-4 w-4 text-black" />
              {label(item.choice)} {/* Yes / No / Abstain with color */}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-sm whitespace-pre-wrap break-words">
              {item.rationale?.trim() || "— No rationale provided —"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
