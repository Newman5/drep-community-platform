import Link from "next/link"
import { Users, Vote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            🗳️ Gimbalabs DRep is Live
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Voice{" "}
            </span>
            is Our Strength
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl mx-auto">
            Join the Gimbalabs DRep Community and participate in Cardano&apos;s decentralized governance. Share your voice, vote on proposals, and help build the future of a decentralized ecosystem.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/gov-actions">
                Vote Now
                <Vote className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/delegate">
                <Users className="mr-2 h-5 w-5" />
                Join Us
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            Trusted by 60+ Cardano community members
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">Andamio</div>
            <div className="text-2xl font-bold">ODIN</div>
            <div className="text-2xl font-bold">Swarm</div>
            <div className="text-2xl font-bold">Governance Guild</div>
            <div className="text-2xl font-bold">GameChanger</div>
          </div>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  )
}