"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, MinusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { GovActionWithResults } from "@/lib/gov-actions";

interface ProposalsClientProps {
  proposals: GovActionWithResults[];
}

export default function ProposalsClient({ proposals }: ProposalsClientProps) {
  const [searchTerm] = useState("");
  const [selectedCategory] = useState("All Categories");
  const [sortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the full URL for client-side fetch
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const pendingProposalsResponse = await fetch(
          `${baseUrl}/api/pending-gov-actions`,
          {
            cache: "no-store", // Ensure fresh data
          }
        );

        if (!pendingProposalsResponse.ok) {
          throw new Error(
            `Failed to fetch: ${pendingProposalsResponse.status}`
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedProposals = useMemo(() => {
    const filtered = proposals.filter((proposal) => {
      // Since submittedBy is not available, we'll search by proposal ID and category
      const matchesSearch =
        proposal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        proposal.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort proposals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.votingDeadline).getTime() -
            new Date(a.votingDeadline).getTime()
          );
        case "oldest":
          return (
            new Date(a.votingDeadline).getTime() -
            new Date(b.votingDeadline).getTime()
          );
        case "mostVotes":
          return b.currentResults.totalVotes - a.currentResults.totalVotes;
        case "deadline":
          return a.daysRemaining - b.daysRemaining;
        default:
          return 0;
      }
    });

    return filtered;
  }, [proposals, searchTerm, selectedCategory, sortBy, loading]);

  return (
    <>
      {/* Proposals List */}
      <div className="space-y-6">
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {filteredAndSortedProposals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No proposals found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}
            {filteredAndSortedProposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                          <Link
                            href={`/vote/${encodeURIComponent(proposal.id)}`}
                          >
                            Proposal {proposal.id}
                          </Link>
                        </h3>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      {proposal.daysRemaining > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {proposal.daysRemaining} days left
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voting Results */}
                  {proposal.currentResults.totalVotes > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          Current Results
                        </span>
                        <span className="text-muted-foreground">
                          {proposal.currentResults.totalVotes.toLocaleString()}{" "}
                          votes
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Yes
                            </span>
                            <span className="font-medium">
                              {proposal.currentResults.yes}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.currentResults.yes}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3 w-3 text-red-600" />
                              No
                            </span>
                            <span className="font-medium">
                              {proposal.currentResults.no}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.currentResults.no}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1">
                              <MinusCircle className="h-3 w-3 text-gray-600" />
                              Abstain
                            </span>
                            <span className="font-medium">
                              {proposal.currentResults.abstain}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.currentResults.abstain}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/vote/${encodeURIComponent(proposal.id)}`}>
                        <Button size="sm">Vote Now</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Pagination would go here for real implementation */}
      {filteredAndSortedProposals.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProposals.length} of {proposals.length}{" "}
            proposals
          </p>
        </div>
      )}
    </>
  );
}
