import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Wallet connection area */}
          <div className="mb-4">
            <Skeleton className="h-12 w-48" />
          </div>
          
          {/* Main title */}
          <div className="flex justify-center mb-6">
            <Skeleton className="h-9 w-80" />
          </div>
          
          {/* Main content card */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                {/* Category badge */}
                <Skeleton className="h-6 w-32 mb-4" />
                
                {/* Proposal ID */}
                <Skeleton className="h-7 w-full max-w-2xl mb-4" />
                
                {/* Links and info */}
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              
              {/* Vote form */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <Skeleton className="h-6 w-40" />
                  
                  {/* Vote choice options */}
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Rationale textarea */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  
                  {/* Submit button */}
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}