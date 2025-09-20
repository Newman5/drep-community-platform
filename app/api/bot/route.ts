import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', message: 'Bot API is running' },
    { status: 200 }
  );
}