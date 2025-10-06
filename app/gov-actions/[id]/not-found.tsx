import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-12">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Governance Action Not Found</h1>
              <p className="text-lg text-muted-foreground mb-8">
                The governance action you're looking for doesn't exist or may have been removed.
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/gov-actions" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Governance Actions
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}