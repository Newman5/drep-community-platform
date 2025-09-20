"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Calendar, Clock, Users, CheckCircle, XCircle, MinusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock proposals data
const mockProposals = [
  {
    id: "PROP-2025-001",
    title: "Fund Development of DRep Tools and Education Platform",
    description: "Develop comprehensive DRep tools and educational resources to help community members understand and participate in Cardano governance more effectively.",
    status: "active",
    category: "Info Action",
    submittedBy: "Gimbalabs",
    submissionDate: "2025-09-15",
    votingDeadline: "2025-10-15",
    requestedAmount: "150,000 ADA",
    currentResults: {
      yes: 65,
      no: 20,
      abstain: 15,
      totalVotes: 1250
    },
    daysRemaining: 25,
  },
  {
    id: "PROP-2025-002",
    title: "Cardano Community Events Funding Program",
    description: "Establish a recurring funding program for community-organized Cardano events, meetups, and educational workshops worldwide.",
    status: "active",
    category: "Info Action",
    submittedBy: "Cardano Foundation",
    submissionDate: "2025-09-10",
    votingDeadline: "2025-10-10",
    requestedAmount: "500,000 ADA",
    currentResults: {
      yes: 78,
      no: 12,
      abstain: 10,
      totalVotes: 2340
    },
    daysRemaining: 20,
  },
  {
    id: "PROP-2025-003",
    title: "Sustainability Research Initiative",
    description: "Fund research into sustainable blockchain technologies and carbon-neutral solutions for the Cardano ecosystem.",
    status: "active",
    category: "Info Action",
    submittedBy: "Green Cardano Initiative",
    submissionDate: "2025-09-05",
    votingDeadline: "2025-10-05",
    requestedAmount: "300,000 ADA",
    currentResults: {
      yes: 45,
      no: 35,
      abstain: 20,
      totalVotes: 890
    },
    daysRemaining: 15,
  },
  {
    id: "PROP-2025-004",
    title: "DeFi Education and Safety Program",
    description: "Create educational materials and safety guidelines for DeFi participation on Cardano, including smart contract auditing resources.",
    status: "pending",
    category: "Info Action",
    submittedBy: "DeFi Safety Alliance",
    submissionDate: "2025-09-20",
    votingDeadline: "2025-10-20",
    requestedAmount: "200,000 ADA",
    currentResults: {
      yes: 0,
      no: 0,
      abstain: 0,
      totalVotes: 0
    },
    daysRemaining: 30,
  },
  {
    id: "PROP-2025-005",
    title: "Native Token Standards Enhancement",
    description: "Improve native token standards and create developer tools for better token management and metadata handling.",
    status: "completed",
    category: "Parameter Change",
    submittedBy: "IOHK",
    submissionDate: "2025-08-01",
    votingDeadline: "2025-09-01",
    requestedAmount: "400,000 ADA",
    currentResults: {
      yes: 82,
      no: 10,
      abstain: 8,
      totalVotes: 3450
    },
    daysRemaining: 0,
  },
  {
    id: "PROP-2025-006",
    title: "Multi-Language Documentation Project",
    description: "Translate core Cardano documentation and governance materials into 10 major world languages to increase global accessibility.",
    status: "rejected",
    category: "Info Action",
    submittedBy: "Global Cardano Alliance",
    submissionDate: "2025-08-15",
    votingDeadline: "2025-09-15",
    requestedAmount: "180,000 ADA",
    currentResults: {
      yes: 35,
      no: 55,
      abstain: 10,
      totalVotes: 1890
    },
    daysRemaining: 0,
  }
]

const categories = [
  "Hard Fork Initiation",
  "New Committee",
  "New Constitution",
  "Info Action",
  "No Confidence",
  "Parameter Change",
  "Treasury Withdrawals"
]

const statusOptions = [
  "active",
]

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("newest")

  const filteredAndSortedProposals = useMemo(() => {
    let filtered = mockProposals.filter((proposal) => {
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
  }, [searchTerm, selectedCategory, selectedStatus, sortBy])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getResultIcon = (proposal: any) => {
    if (proposal.status === "active") {
      if (proposal.currentResults.yes > 50) {
        return <CheckCircle className="h-4 w-4 text-green-600" />
      } else if (proposal.currentResults.no > 50) {
        return <XCircle className="h-4 w-4 text-red-600" />
      } else {
        return <MinusCircle className="h-4 w-4 text-gray-600" />
      }
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

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

        {/* Proposals List */}
        <div className="space-y-6">
          {filteredAndSortedProposals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-lg text-muted-foreground">No proposals found matching your criteria.</p>
                {/* <Button className="mt-4" onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                  setSelectedStatus("All Status")
                }}>
                  Clear Filters
                </Button> */}
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
                          <Link href={`/vote?id=${proposal.id}`}>
                            {proposal.title}
                          </Link>
                        </h3>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {proposal.submissionDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {proposal.submittedBy}
                        </span>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="text-lg font-semibold text-blue-600 mb-1">
                        {proposal.requestedAmount}
                      </div>
                      {proposal.status === "active" && (
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
                        <Link href={`/vote?id=${proposal.id}`}>
                          <Button size="sm">
                            Vote Now
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      ID: {proposal.id}
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
              Showing {filteredAndSortedProposals.length} of {mockProposals.length} proposals
            </p>
          </div>
        )}
      </div>
    </div>
  )
}