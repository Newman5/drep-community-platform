"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { runGovActionsUpdate } from "./sync-gov-actions-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { useStaleRefresh } from "./hooks/useStaleRefresh";

interface UpdateStatus {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  success: boolean;
}

export function UpdateGovActions() {
  const [status, setStatus] = useState<UpdateStatus>({
    loading: false,
    error: null,
    lastUpdated: null,
    success: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Initialize with delay to prevent flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const updateData = useCallback(async () => {
    if (status.loading) return;

    setStatus((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      await runGovActionsUpdate();
      setStatus((prev) => ({
        ...prev,
        loading: false,
        lastUpdated: new Date(),
        success: true,
      }));
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      console.error("Failed to update governance actions:", error);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to update governance data. Please try again.",
      }));
    }
  }, [status.loading, router]);

  // Auto-refresh 6 hours after last update using local storage
  useStaleRefresh(status.lastUpdated, status.loading, updateData, {
    runIfNeverUpdated: true, // first-time immediate run
    storageKey: "govActions:lastUpdated", // per-feature key
  });

  // Don't render until initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for stale data (older than 5 minutes)
  const isDataStale =
    status.lastUpdated &&
    Date.now() - status.lastUpdated.getTime() > 5 * 60 * 1000;

  if (status.loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Updating governance data...</span>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Success Message */}
      {status.success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Governance data updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {status.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{status.error}</AlertDescription>
        </Alert>
      )}

      {/* Update Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Data Sync</p>
              <p className="text-xs text-muted-foreground">
                {status.lastUpdated
                  ? `Last updated: ${status.lastUpdated.toLocaleTimeString()}`
                  : "Data not yet synchronized"}
                {isDataStale && " (data may be stale)"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={updateData}
                disabled={status.loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    status.loading ? "animate-spin" : ""
                  }`}
                />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
