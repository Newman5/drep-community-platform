"use client";

import { CardanoWallet } from "@meshsdk/react";

export function CardanoWalletWrapper() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-center max-w-4xl mx-auto">
        <CardanoWallet persist={true} />
      </div>
    </div>
  );
}
