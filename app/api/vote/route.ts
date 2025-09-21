import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { govActionId, vote, rationale, voter } = body;

    // Validate required fields
    if (!govActionId || !vote || !voter) {
      return NextResponse.json(
        { error: 'Missing required fields: govActionId, vote, and voter' },
        { status: 400 }
      );
    }

    // Validate vote choice
    const validChoices = ['YES', 'NO', 'ABSTAIN'];
    const normalizedVote = vote.toUpperCase();
    
    if (!validChoices.includes(normalizedVote)) {
      return NextResponse.json(
        { error: 'Invalid vote choice. Must be YES, NO, or ABSTAIN' },
        { status: 400 }
      );
    }

    // Create the vote in the database
    const newVote = await prisma.vote.create({
      data: {
        govActionId,
        voter: voter,
        choice: normalizedVote as "YES" | "NO" | "ABSTAIN",
        rationale: rationale || null,
      }
    });

    return NextResponse.json({ 
      success: true, 
      vote: newVote 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating vote:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to create vote', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}