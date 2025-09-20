'use client';

import { useEffect, useState } from "react";

export default function TestPage() {
    const [data, setData] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Construct the full URL for client-side fetch
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                const pendingProposalsResponse = await fetch(`${baseUrl}/api/pending-gov-actions`, {
                    cache: 'no-store' // Ensure fresh data
                });
                
                if (!pendingProposalsResponse.ok) {
                    throw new Error(`Failed to fetch: ${pendingProposalsResponse.status}`);
                }
                
                const pendingProposalsData = await pendingProposalsResponse.json();
                const pendingProposals = pendingProposalsData.pendingProposals;
                
                setData(pendingProposals);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}