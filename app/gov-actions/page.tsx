import { Suspense } from "react"
import { Metadata } from "next"
import { getVotePendingGovActions } from "@/lib/gov-actions"
import VotePendingGovActionsPage from "../../components/gov-actions/vote-pending-gov-actions"
import SuccessNotification from "@/components/success-notification"
import { UpdateGovActions } from "./sync-gov-actions"
import { ErrorBoundary } from "@/components/error-boundary"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Governance Proposals | Gimbalabs DRep Community",
  description: "Explore and vote on proposals that shape the future of Cardano. Participate in democratic governance of the Cardano ecosystem.",
  keywords: ["Cardano", "governance", "proposals", "voting", "DRep", "democracy"],
  openGraph: {
    title: "Governance Proposals",
    description: "Participate in Cardano governance by voting on proposals",
    type: "website",
  },
}

export default async function GovActionsPage() {
  let votePendingGovActions: Awaited<ReturnType<typeof getVotePendingGovActions>> = []
  let error: string | null = null

  try {
    votePendingGovActions = await getVotePendingGovActions()
  } catch (err) {
    console.error('Failed to fetch governance actions:', err)
    error = 'Failed to load governance proposals. Please try refreshing the page.'
    votePendingGovActions = []
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Governance Proposals</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore and vote on proposals that shape the future of Cardano.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Suspense fallback={null}>
          <SuccessNotification />
        </Suspense>
        
        <ErrorBoundary>
          <UpdateGovActions />
          <VotePendingGovActionsPage votePendingGovActions={votePendingGovActions} />
        </ErrorBoundary>
      </div>
    </div>
  )
}