import { Suspense } from "react"
import { getVotePendingGovActions } from "@/lib/gov-actions"
import VotePendingGovActionsPage from "../../components/gov-actions/vote-pending-gov-actions"
import SuccessNotification from "@/components/success-notification"
import { UpdateGovActions } from "./sync-gov-actions"

export default async function GovActionsPage() {
  const votePendingGovActions = await getVotePendingGovActions()

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
        <Suspense fallback={null}>
          <SuccessNotification />
        </Suspense>
        <UpdateGovActions />
        <VotePendingGovActionsPage votePendingGovActions={votePendingGovActions} />
      </div>
    </div>
  )
}