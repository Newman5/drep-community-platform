import { Suspense } from "react"
import { getActiveGovActions } from "@/lib/gov-actions"
import ProposalsClient from "./proposals-client"
import SuccessNotification from "@/components/success-notification"

export default async function ProposalsPage() {
  const mockProposals = await getActiveGovActions()

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
        <ProposalsClient proposals={mockProposals} />
      </div>
    </div>
  )
}