"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  LinkIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GovActionWithResults } from "@/lib/gov-actions";

interface VotePendingGovActionsPageProps {
  votePendingGovActions: GovActionWithResults[];
}

export default function VotePendingGovActionsPage({
  votePendingGovActions,
}: VotePendingGovActionsPageProps) {
  return (
    <>
      {/* Proposals List */}
      <div className="space-y-6">
        {votePendingGovActions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">
                Nothing to vote on.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {votePendingGovActions.map((govAction) => (
              <Card
                key={govAction.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                          <Link
                            href={`/gov-actions/${encodeURIComponent(
                              govAction.id
                            )}`}
                          >
                            {govAction.id}
                          </Link>
                        </h3>
                        <Badge variant="outline">{govAction.category}</Badge>
                        <Badge>
                          <Link
                            href={`/proposals/${govAction.id}`}
                            className="flex items-center gap-2"
                          >
                            <LinkIcon className="h-4 w-4" /> GovTool
                          </Link>
                        </Badge>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      {govAction.daysRemaining > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {govAction.daysRemaining} days left
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voting Results */}
                  {govAction.currentResults.totalVotes > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          Current Results
                        </span>
                        <span className="text-muted-foreground">
                          {govAction.currentResults.totalVotes.toLocaleString()}{" "}
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
                              {govAction.currentResults.yes}%
                            </span>
                          </div>
                          <Progress
                            value={govAction.currentResults.yes}
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
                              {govAction.currentResults.no}%
                            </span>
                          </div>
                          <Progress
                            value={govAction.currentResults.no}
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
                              {govAction.currentResults.abstain}%
                            </span>
                          </div>
                          <Progress
                            value={govAction.currentResults.abstain}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Pagination would go here for real implementation */}
      {votePendingGovActions.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Showing {votePendingGovActions.length} of{" "}
            {votePendingGovActions.length} proposals
          </p>
        </div>
      )}
    </>
  );
}
