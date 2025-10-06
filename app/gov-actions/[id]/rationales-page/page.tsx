"use client";
import { Suspense } from "react";
import { Metadata } from "next";
import CommunityRationales from "@/components/community-rationales";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Note: This is a client component, so we can't use generateMetadata
// Consider moving to server component if SEO is important

function RationalesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-64" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RationalesError() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Failed to load community rationales. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RationalePage() {
  return (
    <Suspense fallback={<RationalesLoading />}>
      <CommunityRationales />
    </Suspense>
  );
}
