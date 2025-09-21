import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to participate in governance?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join hundreds of Cardano community members who are actively shaping the future of the ecosystem through democratic governance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/gov-actions">
                Vote Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/community">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Open to all Cardano stakeholders • Build trust • Start participating today
          </p>
        </div>
      </div>
    </section>
  )
}