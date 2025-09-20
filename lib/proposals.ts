import { prisma } from './prisma'
import { ProposalCategory } from '@prisma/client'

export interface ProposalWithResults {
  id: string
  status: string
  category: string
  submittedBy: string
  votingDeadline: string
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
        id: proposal.id,
        status: proposal.status.toLowerCase(),
        category: formatCategoryName(proposal.category),
        submittedBy: proposal.submitter.name || 'Anonymous',
        votingDeadline: proposal.votingDeadline.toISOString().split('T')[0],
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

export async function getProposalById(id: string): Promise<ProposalWithResults | null> {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
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
      id: proposal.id,
      status: proposal.status.toLowerCase(),
      category: formatCategoryName(proposal.category),
      submittedBy: proposal.submitter.name || 'Anonymous',
      votingDeadline: proposal.votingDeadline.toISOString().split('T')[0],
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
    case 'info_action':
      return 'Info Action'
    case 'parameter_change':
      return 'Parameter Change'
    case 'treasury_withdrawals':
      return 'Treasury Withdrawals'
    case 'hard_fork_initiation':
      return 'Hard Fork Initiation'
    case 'new_committee':
      return 'New Committee'
    case 'new_constitution':
      return 'New Constitution'
    case 'no_confidence':
      return 'No Confidence'
    default:  
      return category
  }
}