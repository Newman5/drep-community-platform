import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    
    console.log("Fetching gov action with ID:", decodedId);
    const govAction = await prisma.govAction.findUnique({
      where: { id: decodedId },
    });

    if (!govAction) {
      return NextResponse.json(
        { error: 'Gov action not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(govAction);
  } catch (error) {
    console.error('Error fetching gov action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}