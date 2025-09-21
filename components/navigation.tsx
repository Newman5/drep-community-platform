"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Vote, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()
  const isGovActionDetail = pathname?.startsWith('/gov-actions/') && pathname !== '/gov-actions'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Vote className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Gimbalabs</span>
              <span className="text-xs text-muted-foreground leading-tight">DRep Community</span>
            </div>
          </Link>
          
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          {isGovActionDetail ? (
            <Button variant="ghost" asChild>
              <Link href="/gov-actions" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Gov Actions</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Delegate to Us</Link>
            </Button>
          )}
          {pathname !== '/gov-actions' && !isGovActionDetail && (
            <Button asChild>
              <Link href="/gov-actions">Vote Now</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}