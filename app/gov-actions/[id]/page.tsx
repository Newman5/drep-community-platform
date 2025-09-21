import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ClientMeshProvider } from '@/components/mesh-provider';
import TokenGating from '@/components/token-gating';

interface VotePageProps {
  params: Promise<{ id: string }>;
}

async function getGovAction(id: string) {
  try {
    const decodedId = decodeURIComponent(id);
    
    console.log("Fetching gov action with ID:", decodedId);
    const govAction = await prisma.govAction.findUnique({
      where: { id: decodedId },
    });

    if (!govAction) {
      return null;
    }

    return govAction;
  } catch (error) {
    console.error('Error fetching gov action:', error);
    return null;
  }
}

async function getUserVote(govActionId: string, voter: string) {
  try {
    const vote = await prisma.vote.findUnique({
      where: {
        voter_govActionId: {
          voter: voter,
          govActionId: govActionId
        }
      }
    });

    return vote;
  } catch (error) {
    console.error('Error fetching user vote:', error);
    return null;
  }
}

export default async function VotePage({ params }: VotePageProps) {
  const { id } = await params;
  const govAction = await getGovAction(id);

  if (!govAction) {
    notFound();
  }

  // Check if user has already voted (using test-user for now)
  const existingVote = await getUserVote(govAction.id, 'test-user');

  return (
    <ClientMeshProvider>
    <div className="min-h-screen bg-background">
      <TokenGating govAction={govAction} existingVote={existingVote} />
    </div>
    </ClientMeshProvider>
  );
}
