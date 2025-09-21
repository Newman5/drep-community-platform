"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { runGovActionsUpdate } from "./sync-gov-actions-server";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UpdateGovActions() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function update() {
      setLoading(true); // start loading
      await runGovActionsUpdate(); // run server action
      router.refresh(); // refresh page with new data
      setLoading(false); // stop loading
    }
    update();
  }, [router]);

  if (!loading) return null; // nothing to render if not loading

  return (
    <Card className="p-6 mb-6">
      <CardContent className="p-12 text-center">
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto mt-2" />
      </CardContent>
    </Card>
  );
}
