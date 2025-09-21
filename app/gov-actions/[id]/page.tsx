import { notFound } from 'next/navigation';
import Link from "next/link";
import { Clock, LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VoteForm from "@/components/vote-form";
import prisma from '@/lib/prisma';

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {govAction.category}
            </Badge>
            <h1 className="text-xl font-bold mb-4">{govAction.id}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href={`/proposals/${govAction.id}`}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" /> GovTool
              </Link>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> days remaining
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Voting Form */}
              <VoteForm govActionId={govAction.id} existingVote={existingVote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
