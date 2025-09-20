import { PrismaClient, ProposalCategory, ProposalStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create some sample users (DReps and submitters)
  const gimbalabsUser = await prisma.user.upsert({
    where: { walletId: 'addr1_gimbalabs' },
    update: {},
    create: {
      walletId: 'addr1_gimbalabs',
      name: 'Gimbalabs',
      email: 'hello@gimbalabs.com',
      isDRep: true,
      drepTitle: 'Education & Developer Tools',
      drepBio: 'Focused on blockchain education and developer tooling for the Cardano ecosystem.',
      drepWebsite: 'https://gimbalabs.com'
    }
  })

  const cardanoFoundationUser = await prisma.user.upsert({
    where: { walletId: 'addr1_cardano_foundation' },
    update: {},
    create: {
      walletId: 'addr1_cardano_foundation',
      name: 'Cardano Foundation',
      email: 'governance@cardanofoundation.org',
      isDRep: true,
      drepTitle: 'Foundation Representative',
      drepBio: 'Official representative of the Cardano Foundation for governance matters.',
      drepWebsite: 'https://cardanofoundation.org'
    }
  })

  const greenCardanoUser = await prisma.user.upsert({
    where: { walletId: 'addr1_green_cardano' },
    update: {},
    create: {
      walletId: 'addr1_green_cardano',
      name: 'Green Cardano Initiative',
      email: 'contact@greencardano.org',
      isDRep: true,
      drepTitle: 'Sustainability & Environmental Focus',
      drepBio: 'Promoting sustainable practices and environmental consciousness in the Cardano ecosystem.',
      drepWebsite: 'https://greencardano.org'
    }
  })

  const defiSafetyUser = await prisma.user.upsert({
    where: { walletId: 'addr1_defi_safety' },
    update: {},
    create: {
      walletId: 'addr1_defi_safety',
      name: 'DeFi Safety Alliance',
      email: 'info@defisafety.com',
      isDRep: true,
      drepTitle: 'DeFi Security & Education',
      drepBio: 'Focused on DeFi safety, security audits, and user education.',
      drepWebsite: 'https://defisafety.com'
    }
  })

  const iohkUser = await prisma.user.upsert({
    where: { walletId: 'addr1_iohk' },
    update: {},
    create: {
      walletId: 'addr1_iohk',
      name: 'IOHK',
      email: 'governance@iohk.io',
      isDRep: true,
      drepTitle: 'Core Development Team',
      drepBio: 'Core development team behind Cardano blockchain technology.',
      drepWebsite: 'https://iohk.io'
    }
  })

  const globalAllianceUser = await prisma.user.upsert({
    where: { walletId: 'addr1_global_alliance' },
    update: {},
    create: {
      walletId: 'addr1_global_alliance',
      name: 'Global Cardano Alliance',
      email: 'hello@globalcardano.org',
      isDRep: true,
      drepTitle: 'Global Community Representative',
      drepBio: 'Representing global Cardano community interests and promoting worldwide adoption.',
      drepWebsite: 'https://globalcardano.org'
    }
  })

  console.log('Created sample users...')

  // Create proposals based on the mock data
  const proposals = [
    {
      externalId: "PROP-2025-001",
      title: "Fund Development of DRep Tools and Education Platform",
      description: "Develop comprehensive DRep tools and educational resources to help community members understand and participate in Cardano governance more effectively.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      requestedAmount: "150,000 ADA",
      submitterId: gimbalabsUser.id,
      submissionDate: new Date("2025-09-15"),
      votingDeadline: new Date("2025-10-15"),
    },
    {
      externalId: "PROP-2025-002",
      title: "Cardano Community Events Funding Program",
      description: "Establish a recurring funding program for community-organized Cardano events, meetups, and educational workshops worldwide.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      requestedAmount: "500,000 ADA",
      submitterId: cardanoFoundationUser.id,
      submissionDate: new Date("2025-09-10"),
      votingDeadline: new Date("2025-10-10"),
    },
    {
      externalId: "PROP-2025-003",
      title: "Sustainability Research Initiative",
      description: "Fund research into sustainable blockchain technologies and carbon-neutral solutions for the Cardano ecosystem.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      requestedAmount: "300,000 ADA",
      submitterId: greenCardanoUser.id,
      submissionDate: new Date("2025-09-05"),
      votingDeadline: new Date("2025-10-05"),
    },
    {
      externalId: "PROP-2025-004",
      title: "DeFi Education and Safety Program",
      description: "Create educational materials and safety guidelines for DeFi participation on Cardano, including smart contract auditing resources.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.PENDING,
      requestedAmount: "200,000 ADA",
      submitterId: defiSafetyUser.id,
      submissionDate: new Date("2025-09-20"),
      votingDeadline: new Date("2025-10-20"),
    },
    {
      externalId: "PROP-2025-005",
      title: "Native Token Standards Enhancement",
      description: "Improve native token standards and create developer tools for better token management and metadata handling.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.COMPLETED,
      requestedAmount: "400,000 ADA",
      submitterId: iohkUser.id,
      submissionDate: new Date("2025-08-01"),
      votingDeadline: new Date("2025-09-01"),
    },
    {
      externalId: "PROP-2025-006",
      title: "Multi-Language Documentation Project",
      description: "Translate core Cardano documentation and governance materials into 10 major world languages to increase global accessibility.",
      category: ProposalCategory.info_action,
      status: ProposalStatus.REJECTED,
      requestedAmount: "180,000 ADA",
      submitterId: globalAllianceUser.id,
      submissionDate: new Date("2025-08-15"),
      votingDeadline: new Date("2025-09-15"),
    }
  ]

  console.log('Creating proposals...')

  for (const proposalData of proposals) {
    await prisma.proposal.upsert({
      where: { externalId: proposalData.externalId },
      update: proposalData,
      create: proposalData
    })
  }

  console.log('Created proposals...')

  // Create some sample voters
  const voters = []
  for (let i = 1; i <= 20; i++) {
    const voter = await prisma.user.upsert({
      where: { walletId: `addr1_voter_${i}` },
      update: {},
      create: {
        walletId: `addr1_voter_${i}`,
        name: `Community Member ${i}`,
        email: `voter${i}@cardano.community`,
        isDRep: i <= 5, // First 5 are also DReps
        drepTitle: i <= 5 ? `Community DRep ${i}` : null,
        drepBio: i <= 5 ? `Community representative focused on various aspects of Cardano governance.` : null,
      }
    })
    voters.push(voter)
  }

  console.log('Created sample voters...')

  // Create sample votes for active and completed proposals
  const createdProposals = await prisma.proposal.findMany()
  
  // Vote distributions based on the mock data
  const voteDistributions = {
    "PROP-2025-001": { yes: 65, no: 20, abstain: 15, totalVotes: 1250 },
    "PROP-2025-002": { yes: 78, no: 12, abstain: 10, totalVotes: 2340 },
    "PROP-2025-003": { yes: 45, no: 35, abstain: 20, totalVotes: 890 },
    "PROP-2025-005": { yes: 82, no: 10, abstain: 8, totalVotes: 3450 },
    "PROP-2025-006": { yes: 35, no: 55, abstain: 10, totalVotes: 1890 }
  }

  console.log('Creating sample votes...')

  for (const proposal of createdProposals) {
    const distribution = voteDistributions[proposal.externalId as keyof typeof voteDistributions]
    if (distribution) {
      // Calculate actual vote counts
      const yesVotes = Math.floor((distribution.yes / 100) * distribution.totalVotes)
      const noVotes = Math.floor((distribution.no / 100) * distribution.totalVotes)
      const abstainVotes = distribution.totalVotes - yesVotes - noVotes

      let votesCreated = 0
      
      // Create YES votes
      for (let i = 0; i < yesVotes && votesCreated < voters.length; i++) {
        if (voters[votesCreated]) {
          await prisma.vote.upsert({
            where: {
              userId_proposalId: {
                userId: voters[votesCreated].id,
                proposalId: proposal.id
              }
            },
            update: {},
            create: {
              userId: voters[votesCreated].id,
              proposalId: proposal.id,
              choice: 'YES',
              rationale: Math.random() > 0.7 ? `I support this proposal because it aligns with Cardano's vision for decentralized governance.` : null
            }
          })
          votesCreated++
        }
      }

      // Create NO votes
      for (let i = 0; i < noVotes && votesCreated < voters.length; i++) {
        if (voters[votesCreated]) {
          await prisma.vote.upsert({
            where: {
              userId_proposalId: {
                userId: voters[votesCreated].id,
                proposalId: proposal.id
              }
            },
            update: {},
            create: {
              userId: voters[votesCreated].id,
              proposalId: proposal.id,
              choice: 'NO',
              rationale: Math.random() > 0.7 ? `I have concerns about the implementation details and budget allocation.` : null
            }
          })
          votesCreated++
        }
      }

      // Create ABSTAIN votes
      for (let i = 0; i < abstainVotes && votesCreated < voters.length; i++) {
        if (voters[votesCreated]) {
          await prisma.vote.upsert({
            where: {
              userId_proposalId: {
                userId: voters[votesCreated].id,
                proposalId: proposal.id
              }
            },
            update: {},
            create: {
              userId: voters[votesCreated].id,
              proposalId: proposal.id,
              choice: 'ABSTAIN',
              rationale: Math.random() > 0.8 ? `I need more information before making a decision.` : null
            }
          })
          votesCreated++
        }
      }
    }
  }

  console.log('Created sample votes...')

  // Create some sample delegations
  console.log('Creating sample delegations...')
  const regularUsers = voters.filter(v => !v.isDRep)
  const dreps = [gimbalabsUser, cardanoFoundationUser, greenCardanoUser, defiSafetyUser, iohkUser, ...voters.filter(v => v.isDRep)]

  for (let i = 0; i < regularUsers.length; i++) {
    const randomDRep = dreps[Math.floor(Math.random() * dreps.length)]
    if (randomDRep && regularUsers[i]) {
      await prisma.dRepDelegation.upsert({
        where: {
          userId_isActive: {
            userId: regularUsers[i].id,
            isActive: true
          }
        },
        update: {},
        create: {
          userId: regularUsers[i].id,
          drepId: randomDRep.id,
          isActive: true
        }
      })
    }
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })