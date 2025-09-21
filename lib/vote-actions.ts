'use server';

import prisma from '@/lib/prisma';

export async function submitVote(formData: FormData) {
  const govActionId = formData.get('govActionId') as string;
  const vote = formData.get('vote') as string;
  const rationale = formData.get('rationale') as string;
  const voter = formData.get('voter') as string;

  // Validate required fields
  if (!govActionId || !vote || !voter) {
    throw new Error('Missing required fields: govActionId, vote, and voter');
  }

  // Validate vote choice
  const validChoices = ['YES', 'NO', 'ABSTAIN'];
  const normalizedVote = vote.toUpperCase();
  
  if (!validChoices.includes(normalizedVote)) {
    throw new Error('Invalid vote choice. Must be YES, NO, or ABSTAIN');
  }

  try {
    // Check if user has already voted on this proposal
    const existingVote = await prisma.vote.findUnique({
      where: {
        voter_govActionId: {
          voter: voter,
          govActionId: govActionId
        }
      }
    });

    if (existingVote) {
      // Update existing vote instead of creating a new one
      await prisma.vote.update({
        where: {
          voter_govActionId: {
            voter: voter,
            govActionId: govActionId
          }
        },
        data: {
          choice: normalizedVote as "YES" | "NO" | "ABSTAIN",
          rationale: rationale || null,
          updatedAt: new Date()
        }
      });
    } else {
      // Create a new vote
      await prisma.vote.create({
        data: {
          govActionId,
          voter: voter,
          choice: normalizedVote as "YES" | "NO" | "ABSTAIN",
          rationale: rationale || null,
        }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating vote:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw new Error('You have already voted on this proposal. Please refresh the page to see your current vote.');
    }
    
    throw new Error('Failed to create vote');
  }
}