import { prisma } from './prisma'
import { ProposalCategory } from '@prisma/client'

export interface ProposalWithResults {
  id: string
  externalId: string
  title: string
  description: string
  status: string
  category: string
  submittedBy: string
  submissionDate: string
  votingDeadline: string
  requestedAmount: string
  currentResults: {
    yes: number
    no: number
    abstain: number
    totalVotes: number
  }
  daysRemaining: number
}

export async function getAllProposals(): Promise<ProposalWithResults[]> {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        submitter: true,
        votes: true,
      },
      orderBy: {
        submissionDate: 'desc'
      }
    })

    return proposals.map(proposal => {
      // Calculate vote results
      const totalVotes = proposal.votes.length
      const yesVotes = proposal.votes.filter(vote => vote.choice === 'YES').length
      const noVotes = proposal.votes.filter(vote => vote.choice === 'NO').length
      const abstainVotes = proposal.votes.filter(vote => vote.choice === 'ABSTAIN').length

      // Calculate percentages
      const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0
      const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0
      const abstainPercentage = totalVotes > 0 ? Math.round((abstainVotes / totalVotes) * 100) : 0

      // Calculate days remaining
      const now = new Date()
      const deadline = new Date(proposal.votingDeadline)
      const timeDiff = deadline.getTime() - now.getTime()
      const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)))

      return {
        id: proposal.externalId,
        externalId: proposal.externalId,
        title: proposal.title,
        description: proposal.description,
        status: proposal.status.toLowerCase(),
        category: formatCategoryName(proposal.category),
        submittedBy: proposal.submitter.name || 'Anonymous',
        submissionDate: proposal.submissionDate.toISOString().split('T')[0],
        votingDeadline: proposal.votingDeadline.toISOString().split('T')[0],
        requestedAmount: proposal.requestedAmount,
        currentResults: {
          yes: yesPercentage,
          no: noPercentage,
          abstain: abstainPercentage,
          totalVotes: totalVotes
        },
        daysRemaining: daysRemaining
      }
    })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    throw new Error('Failed to fetch proposals')
  }
}

export async function getProposalById(externalId: string): Promise<ProposalWithResults | null> {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { externalId },
      include: {
        submitter: true,
        votes: {
          include: {
            user: true
          }
        }
      }
    })

    if (!proposal) {
      return null
    }

    // Calculate vote results
    const totalVotes = proposal.votes.length
    const yesVotes = proposal.votes.filter(vote => vote.choice === 'YES').length
    const noVotes = proposal.votes.filter(vote => vote.choice === 'NO').length
    const abstainVotes = proposal.votes.filter(vote => vote.choice === 'ABSTAIN').length

    // Calculate percentages
    const yesPercentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0
    const noPercentage = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0
    const abstainPercentage = totalVotes > 0 ? Math.round((abstainVotes / totalVotes) * 100) : 0

    // Calculate days remaining
    const now = new Date()
    const deadline = new Date(proposal.votingDeadline)
    const timeDiff = deadline.getTime() - now.getTime()
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)))

    return {
      id: proposal.externalId,
      externalId: proposal.externalId,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status.toLowerCase(),
      category: formatCategoryName(proposal.category),
      submittedBy: proposal.submitter.name || 'Anonymous',
      submissionDate: proposal.submissionDate.toISOString().split('T')[0],
      votingDeadline: proposal.votingDeadline.toISOString().split('T')[0],
      requestedAmount: proposal.requestedAmount,
      currentResults: {
        yes: yesPercentage,
        no: noPercentage,
        abstain: abstainPercentage,
        totalVotes: totalVotes
      },
      daysRemaining: daysRemaining
    }
  } catch (error) {
    console.error('Error fetching proposal by ID:', error)
    throw new Error('Failed to fetch proposal')
  }
}

function formatCategoryName(category: ProposalCategory): string {
  switch (category) {
    case 'INFO_ACTION':
      return 'Info Action'
    case 'PARAMETER_CHANGE':
      return 'Parameter Change'
    case 'TREASURY_WITHDRAWAL':
      return 'Treasury Withdrawals'
    case 'HARD_FORK_INITIATION':
      return 'Hard Fork Initiation'
    case 'UPDATE_COMMITTEE':
      return 'New Committee'
    case 'NEW_CONSTITUTION':
      return 'New Constitution'
    case 'NO_CONFIDENCE':
      return 'No Confidence'
    default:
      return category
  }
}