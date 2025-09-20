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
      id: "89e3a4f09122d669d6f6c82dd894e02826e8497be7eb036233bafc0ee4fc6665#0",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      submitterId: gimbalabsUser.id,
      votingDeadline: new Date("2025-10-15"),
    },
    {
      id: "e5643c33f608642e329228a968770e5b19ef5f48ff1f698712e2ce864a49e3f0#0",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      submitterId: cardanoFoundationUser.id,
      votingDeadline: new Date("2025-10-10"),
    },
    {
      id: "996edfe370b8e51be73541e75499a818461305e37c7fa0c1b193f2c587167cc7#0",
      category: ProposalCategory.info_action,
      status: ProposalStatus.ACTIVE,
      submitterId: greenCardanoUser.id,
      votingDeadline: new Date("2025-10-05"),
    }
  ]

  console.log('Creating proposals...')

  for (const proposalData of proposals) {
    await prisma.proposal.upsert({
      where: { id: proposalData.id },
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
    "89e3a4f09122d669d6f6c82dd894e02826e8497be7eb036233bafc0ee4fc6665#0": { yes: 65, no: 20, abstain: 15, totalVotes: 1250 },
    "e5643c33f608642e329228a968770e5b19ef5f48ff1f698712e2ce864a49e3f0#0": { yes: 78, no: 12, abstain: 10, totalVotes: 2340 },
    "996edfe370b8e51be73541e75499a818461305e37c7fa0c1b193f2c587167cc7#0": { yes: 45, no: 35, abstain: 20, totalVotes: 890 }
  }

  console.log('Creating sample votes...')

  for (const proposal of createdProposals) {
    const distribution = voteDistributions[proposal.id as keyof typeof voteDistributions]
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