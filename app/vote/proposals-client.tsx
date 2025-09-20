"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, Clock, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProposalWithResults } from "@/lib/proposals"

interface ProposalsClientProps {
  proposals: ProposalWithResults[]
}

export default function ProposalsClient({ proposals }: ProposalsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy] = useState("newest")

  const filteredAndSortedProposals = useMemo(() => {
    const filtered = proposals.filter((proposal) => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposal.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "All Categories" || proposal.category === selectedCategory
      const matchesStatus = selectedStatus === "All Status" || proposal.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort proposals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        case "oldest":
          return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()
        case "mostVotes":
          return b.currentResults.totalVotes - a.currentResults.totalVotes
        case "deadline":
          return a.daysRemaining - b.daysRemaining
        case "amount":
          return parseInt(b.requestedAmount.replace(/[^0-9]/g, "")) - parseInt(a.requestedAmount.replace(/[^0-9]/g, ""))
        default:
          return 0
      }
    })

    return filtered
  }, [proposals, searchTerm, selectedCategory, selectedStatus, sortBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getResultIcon = (proposal: ProposalWithResults) => {
    if (proposal.status === "active") {
      if (proposal.currentResults.yes > 50) {
        return <CheckCircle className="h-4 w-4 text-green-600" />
      } else if (proposal.currentResults.no > 50) {
        return <XCircle className="h-4 w-4 text-red-600" />
      } else {
        return <MinusCircle className="h-4 w-4 text-gray-600" />
      }
    } else if (proposal.status === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  return (
    <>
      {/* Proposals List */}
      <div className="space-y-6">
        {filteredAndSortedProposals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">No proposals found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                        <Link href={`/vote/${proposal.id}`}>
                          {proposal.title}
                        </Link>
                      </h3>
                      <Badge variant="outline">{proposal.category}</Badge>
                      {getStatusBadge(proposal.status)}
                    </div>
                  </div>
                  
                  <div className="ml-6 text-right">
                    {proposal.status === "active" && proposal.daysRemaining > 0 && (
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
                        {getResultIcon(proposal)}
                        Current Results
                      </span>
                      <span className="text-muted-foreground">
                        {proposal.currentResults.totalVotes.toLocaleString()} votes
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Yes
                          </span>
                          <span className="font-medium">{proposal.currentResults.yes}%</span>
                        </div>
                        <Progress value={proposal.currentResults.yes} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-red-600" />
                            No
                          </span>
                          <span className="font-medium">{proposal.currentResults.no}%</span>
                        </div>
                        <Progress value={proposal.currentResults.no} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1">
                            <MinusCircle className="h-3 w-3 text-gray-600" />
                            Abstain
                          </span>
                          <span className="font-medium">{proposal.currentResults.abstain}%</span>
                        </div>
                        <Progress value={proposal.currentResults.abstain} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {proposal.status === "active" && (
                      <Link href={`/vote/${proposal.id}`}>
                        <Button size="sm">
                          Vote Now
                        </Button>
                      </Link>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination would go here for real implementation */}
      {filteredAndSortedProposals.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProposals.length} of {proposals.length} proposals
          </p>
        </div>
      )}
    </>
  )
}