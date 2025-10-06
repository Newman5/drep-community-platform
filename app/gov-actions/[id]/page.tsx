import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { ClientMeshProvider } from '@/components/mesh-provider';
import TokenGating from '@/components/token-gating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProposalDetailLoadingSkeleton } from '@/components/loading-skeletons';
import type { GovAction, Vote } from '@prisma/client';

interface VotePageProps {
  params: Promise<{ id: string }>;
}

interface OptimizedVotePageData {
  govAction: GovAction;
  existingVote: Vote | null;
  totalVotes: number;
  isExpired: boolean;
}

// Optimized single query that fetches everything we need
const getOptimizedPageData = cache(async (id: string): Promise<OptimizedVotePageData | null> => {
  try {
    const decodedId = decodeURIComponent(id);
    
    if (!decodedId || decodedId.trim() === '') {
      console.warn('Invalid governance action ID provided');
      return null;
    }
    
    console.time(`Loading governance action ${decodedId}`);
    
    // Single optimized query with all needed data
    const govAction = await prisma.govAction.findUnique({
      where: { id: decodedId },
      include: {
        votes: {
          select: {
            id: true,
            choice: true,
            rationale: true,
            createdAt: true,
            updatedAt: true,
            voter: true,
            govActionId: true,
          },
          take: 1000, // Limit to prevent memory issues
        },
      },
    });

    if (!govAction) {
      console.timeEnd(`Loading governance action ${decodedId}`);
      return null;
    }

    // TODO: Replace 'test-user' with actual user from session/auth context
    const currentUser = 'test-user';
    
    // Find existing vote efficiently from the already loaded data
    const existingVote = govAction.votes.find(vote => vote.voter === currentUser) || null;
    
    // Calculate derived data
    const totalVotes = govAction.votes.length;
    const isExpired = new Date() > new Date(govAction.votingDeadline);
    
    console.timeEnd(`Loading governance action ${decodedId}`);
    
    return {
      govAction: {
        id: govAction.id,
        category: govAction.category,
        expired: govAction.expired,
        voted: govAction.voted,
        votingDeadline: govAction.votingDeadline,
      },
      existingVote,
      totalVotes,
      isExpired,
    };
  } catch (error) {
    console.error('Error fetching optimized page data:', error);
    return null;
  }
});

// Lightweight metadata query (separate from main data for streaming)
const getMetadataOnly = cache(async (id: string): Promise<Pick<GovAction, 'id' | 'category'> | null> => {
  try {
    const decodedId = decodeURIComponent(id);
    return await prisma.govAction.findUnique({
      where: { id: decodedId },
      select: {
        id: true,
        category: true,
      },
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
});

// Generate dynamic metadata with lightweight query
export async function generateMetadata({ params }: VotePageProps): Promise<Metadata> {
  const { id } = await params;
  const govAction = await getMetadataOnly(id);
  
  if (!govAction) {
    return {
      title: 'Governance Action Not Found',
      description: 'The requested governance action could not be found.'
    };
  }

  return {
    title: `${govAction.category} Proposal | Gimbalabs DRep`,
    description: `Vote on ${govAction.category} proposal ${govAction.id}. Participate in Cardano governance.`,
    keywords: ['Cardano', 'governance', 'voting', 'DRep', govAction.category],
    openGraph: {
      title: `${govAction.category} Proposal`,
      description: `Vote on governance proposal: ${govAction.id}`,
      type: 'website',
    },
    // Add cache hints for better performance
    other: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    },
  };
}

// Preload component for even faster subsequent loads
function PreloadContent({ pageData }: { pageData: OptimizedVotePageData }) {
  return (
    <ClientMeshProvider>
      <div className="min-h-screen bg-background">
        <TokenGating 
          govAction={pageData.govAction} 
          existingVote={pageData.existingVote}
          totalVotes={pageData.totalVotes}
          isExpired={pageData.isExpired}
        />
      </div>
    </ClientMeshProvider>
  );
}

export default async function VotePage({ params }: VotePageProps) {
  const { id } = await params;
  
  try {
    const pageData = await getOptimizedPageData(id);

    if (!pageData) {
      notFound();
    }

    return (
      <Suspense fallback={<ProposalDetailLoadingSkeleton />}>
        <PreloadContent pageData={pageData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading vote page:', error);
    
    // For errors, show an error page
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An error occurred while loading the governance action. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
}
