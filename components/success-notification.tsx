"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SuccessNotification() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!showSuccess) return null;

  return (
    <Alert className="border-green-200 bg-green-50 text-green-800 mb-6">
      <CheckCircle className="h-4 w-4" />
      <AlertDescription className="text-lg">
        Your vote has been successfully submitted! Thank you for participating in Cardano governance.
      </AlertDescription>
    </Alert>
  );
}