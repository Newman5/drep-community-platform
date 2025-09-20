import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Vote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Gimbalabs</span>
                <span className="text-sm text-muted-foreground leading-tight">DRep Community</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering Cardano stakeholders to participate in democratic governance through education, tools, and community support.
            </p>
            
          </div>

          {/* Governance Links */}
          <div>
            <h4 className="font-semibold mb-4">Governance</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/proposals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Active Proposals
                </Link>
              </li>
              <li>
                <Link href="/delegate" className="text-muted-foreground hover:text-foreground transition-colors">
                  Delegate To Gimbalabs DRep
                </Link>
              </li>
              <li>
                <Link href="/voting-history" className="text-muted-foreground hover:text-foreground transition-colors">
                  Voting History
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Gimbalabs
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discord
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Delegate to GMBL stakepool
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Follow us</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com/gimbalabs" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/gimbalabs" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com/company/gimbalabs" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:hello@gimbalabs.com">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gimbalabs. All rights reserved.
        </div>
      </div>
    </footer>
  )
}