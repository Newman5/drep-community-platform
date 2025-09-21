'use client';

import { useWallet } from '@meshsdk/react';

export default function TokenGating() {
    const { connected } = useWallet();

    if (!connected) {
        return <div>Please connect your wallet to access this content.</div>;
    }

    return <div>Token gated content goes here.</div>;
}