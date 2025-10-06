"use client";

import { hexToString } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useEffect, useState, useMemo } from "react";
import AndamioSDK from "@andamiojs/sdk";
import { parseDatumCbor } from "@meshsdk/core-csl";
import Link from "next/link";
import { Clock, LinkIcon, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VoteForm from "@/components/vote-form";
import { CardanoWalletWrapper } from "./cardano-wallet-wrapper";
import type { GovAction, Vote } from "@prisma/client";

export default function TokenGating({
  govAction,
  existingVote,
  totalVotes = 0,
  isExpired = false,
}: {
  govAction: GovAction;
  existingVote: Vote | null;
  totalVotes?: number;
  isExpired?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isContributor, setIsContributor] = useState(false);
  const [alias, setAlias] = useState<string | null>(null);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { connected, wallet } = useWallet();

  const accessTokenPolicy =
    "e760308d0c14096ff479ec5f2495455505feb790503903fe976c4fd2";
  const projectId = "e0d1a30007bbbc2e4d3c9eb4ab2a5da0a1cd99f32928d1dae1e961e2";

  // Calculate days remaining with memoization
  const daysRemaining = useMemo(() => {
    const now = new Date();
    const deadline = new Date(govAction.votingDeadline);
    const timeDiff = deadline.getTime() - now.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }, [govAction.votingDeadline]);

  // Initialize component to prevent initial flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 50); // Small delay to prevent flash
    return () => clearTimeout(timer);
  }, []);

  // Debounced wallet checking to prevent rapid state changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Reset states when wallet disconnects
    if (!connected) {
      setAlias(null);
      setIsContributor(false);
      setHasCheckedWallet(false);
      return;
    }

    if (connected && wallet && !hasCheckedWallet && !isLoading) {
      const checkAssets = async () => {
        setIsLoading(true);
        
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Verification timeout')), 10000)
          );

          const verificationPromise = (async () => {
            const andamio = new AndamioSDK(
              "https://utxorpc.dolos.andamio.space:443",
              "Mainnet"
            );

            const assets = await wallet.getAssets();
            const accessToken = assets.find(
              (asset) => asset.policyId === accessTokenPolicy
            );
            
            if (!accessToken) {
              throw new Error("You do not hold the required token to access this content.");
            }
            
            const aliasValue = hexToString(accessToken.unit.substring(62));
            setAlias(aliasValue);
            
            const utxo = await andamio.provider.core.globalState.getUtxoByAlias(aliasValue);
            const blockfrostUtxo = andamio.utils.rpcUtxoToBlockfrostUtxo(utxo);
            const datum = parseDatumCbor(blockfrostUtxo.inline_datum as string);
            const credentials = datum.fields[2].list;
            const projectCredential = credentials.find(
              (cred: { fields: { bytes: string }[] }) =>
                cred.fields[0].bytes === projectId
            );
            
            if (!projectCredential) {
              throw new Error("You do not hold the required project credential.");
            }
            
            setIsContributor(true);
          })();

          await Promise.race([verificationPromise, timeoutPromise]);
        } catch (err) {
          console.error('Token verification failed:', err);
        } finally {
          setIsLoading(false);
          setHasCheckedWallet(true);
        }
      };
      
      // Debounce the check to prevent rapid calls
      const timer = setTimeout(checkAssets, 300);
      return () => clearTimeout(timer);
    }
  }, [connected, wallet, accessTokenPolicy, projectId, hasCheckedWallet, isLoading, isInitialized]);

  // Stable derived states to prevent flickering
  const isEnabled = isContributor && alias;
  const showWalletPrompt = isInitialized && !connected;
  const showLoading = isInitialized && connected && (isLoading || !hasCheckedWallet);
  const showContent = isInitialized && connected;

  // Don't render anything until initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="h-9 bg-gray-200 rounded mb-6 w-80 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 gov-action-container">
      <div className="max-w-4xl mx-auto">
        <CardanoWalletWrapper />

        <div className="flex justify-center">
          <h1 className="text-3xl font-bold mb-4 min-h-[2.5rem] flex items-center gov-action-title">
            {showLoading ? (
              "Verifying access..."
            ) : isEnabled ? (
              <>
                Welcome <i>{alias}</i>, Cast your vote!
              </>
            ) : showWalletPrompt ? (
              "Connect Wallet to Vote"
            ) : connected ? (
              "Cast your vote!"
            ) : (
              "Connect Wallet to Vote"
            )}
          </h1>
        </div>

        {/* Loading State - Only show during actual verification */}
        {showLoading && (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">
              Checking your credentials on the blockchain...
            </p>
          </div>
        )}

        {/* Join prompt - Only show if connected but not verified and not loading */}
        { connected && !isEnabled && !showLoading && (
          <div className="text-center p-4 bg-amber-100 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Join us to participate
            </h2>
            <p className="text-sm">
              Contributors to{" "}
              <Link
                href="https://app.andamio.io/project/e0d1a30007bbbc2e4d3c9eb4ab2a5da0a1cd99f32928d1dae1e961e2"
                className="text-blue-500"
              >
                <i>Sustain and Maintain Gimbalabs</i>
              </Link>{" "}
              can participate in voting.
            </p>
          </div>
        )}

        {/* Main Content - Always render container to prevent layout shift */}
        <div className="container mx-auto px-4 py-12 gov-action-content">
          <div className="max-w-4xl mx-auto governance-main">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {govAction.category}
              </Badge>
              <h1 className="text-xl font-bold mb-4">{govAction.id}</h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link
                  href={`https://gov.tools/governance_actions/${govAction.id}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="h-4 w-4" /> GovTool
                </Link>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 
                  {isExpired ? 'Voting ended' : `${daysRemaining} days remaining`}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/gov-actions/${encodeURIComponent(
                      govAction.id
                    )}/rationales-page`}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Scale className="h-4 w-4" /> Community Rationales
                  </Link>
                </div>
                {totalVotes > 0 && (
                  <div className="flex items-center gap-2">
                    <span>{totalVotes} votes cast</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2 space-y-6 min-h-[400px] vote-form-container">
                {showLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                      Loading voting interface...
                    </p>
                  </div>
                ) : showContent ? (
                  <div className={`transition-opacity duration-300 ${
                    !isEnabled && !showLoading ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}>
                    <VoteForm
                      govActionId={govAction.id}
                      existingVote={existingVote}
                      alias={alias || ""}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Connect your wallet to participate in voting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
