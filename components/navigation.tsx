"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vote, ArrowLeft } from "lucide-react";

export function Navigation() {
  const pathname = usePathname() || "/";

  // Figure out where we are in the app
  const isGovActionsPage = pathname === "/gov-actions"; // list of all proposals
  const isRationalePage = pathname.endsWith("/rationales-page"); // rationales view
  const isGovActionDetail =
    pathname.startsWith("/gov-actions/") &&
    !isRationalePage &&
    pathname !== "/gov-actions"; // single proposal

  // Figure out the correct "Back" link
  const votePageURL = isRationalePage
    ? pathname.replace("/rationales-page", "")
    : "/gov-actions";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side — logo + text */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Vote className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Gimbalabs</span>
              <span className="text-xs text-muted-foreground leading-tight">
                DRep Community
              </span>
            </div>
          </Link>
        </div>

        {/* Right side — nav buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* when viewing a specific proposal */}
          {isGovActionDetail && (
            <Button variant="ghost" asChild>
              <Link href="/gov-actions" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Gov Actions</span>
              </Link>
            </Button>
          )}

          {/* when viewing rationales */}
          {isRationalePage && (
            <Button variant="ghost" asChild>
              <Link href={votePageURL} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Voting</span>
              </Link>
            </Button>
          )}

          {/* when on /gov-actions (main proposals page) */}
          {isGovActionsPage && (
            <Button variant="ghost" asChild>
              <Link href="#">Delegate to Us</Link>
            </Button>
          )}

          {/* everywhere else → show both */}
          {!isGovActionsPage && !isGovActionDetail && !isRationalePage && (
            <>
              <Button variant="ghost" asChild>
                <Link href="#">Delegate to Us</Link>
              </Button>
              <Button asChild>
                <Link href="/gov-actions">Vote Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
