import { Vote, Shield, Users, BarChart3, BookOpen, Heart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Vote,
    title: "Transparent Voting",
    description: "Participate in transparent, on-chain governance with full visibility into every vote and proposal outcome."
  },
  {
    icon: Shield,
    title: "Trusted Delegation",
    description: "Delegate your voting power to trusted community members with provable participation in all things Cardano."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a vibrant community of Cardano stakeholders working together to shape the future of the ecosystem."
  },
  {
    icon: BarChart3,
    title: "Real-time Governance Analytics",
    description: "Track proposal outcomes, voting patterns, and community sentiment with comprehensive governance dashboards."
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Learn about governance, DRep responsibilities, and how to make informed decisions with our comprehensive guides."
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "Get help from experienced community members and participate in discussions about important governance topics."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need for governance</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for democratic participation
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform provides all the tools you need to participate meaningfully in Cardano governance.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}