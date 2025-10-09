import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient()
  const pendingVotesGovActions = await prisma.govAction.findMany({
    where: {
      expired: false,
      voted: false
    }
  })
  return NextResponse.json(
    { status: 'ok', message: pendingVotesGovActions },
    { status: 200 }
  );
}