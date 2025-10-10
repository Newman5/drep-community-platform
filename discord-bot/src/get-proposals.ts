import fetch from 'node-fetch';
import type { GovAction } from '@prisma/client';

/**
 * Type returned by the /api/bot (or /api/gov-actions) route.
 * 'message' contains the list of GovAction records.
 */
interface ApiResponse {
  status: 'ok' | 'error';
  message: GovAction[] | string;
}

const API_URL = process.env.API_URL as string;

/**
 * Fetch proposals from the Next.js API
 */
export async function getProposalsFromAPI(): Promise<GovAction[]> {
  if (!API_URL) throw new Error('Missing API_URL in environment variables');

  const res = await fetch(API_URL);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch proposals: ${res.status} ${text}`);
  }

  const data = (await res.json()) as ApiResponse;

  if (data.status !== 'ok') {
    throw new Error(`API responded with error: ${data.message}`);
  }

  if (!Array.isArray(data.message)) {
    throw new Error('Unexpected API response format');
  }

  return data.message;
}
