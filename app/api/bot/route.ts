import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function GET() {
  try { 
  const prisma = new PrismaClient()
  const pendingVotesGovActions = await prisma.govAction.findMany({
    where: {
      expired: false,
      voted: false
    }
  })
  console.log('[GET /api/gov-actions] pendingVotesGovActions', pendingVotesGovActions)
  return NextResponse.json(
    { status: 'ok', message: pendingVotesGovActions },
    { status: 200 }
  );
  } catch (error) {
    console.error('[GET /api/gov-actions]', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}