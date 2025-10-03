"use client";

import { hexToString } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import AndamioSDK from "@andamiojs/sdk";
import { parseDatumCbor } from "@meshsdk/core-csl";
import Link from "next/link";
import { Clock, LinkIcon, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VoteForm from "@/components/vote-form";
import { CardanoWalletWrapper } from "./cardano-wallet-wrapper";
import type { GovAction, Vote } from "@prisma/client";
// import PublicRationales from "./public-rationales";

export default function TokenGating({
  govAction,
  existingVote,
}: {
  govAction: GovAction;
  existingVote: Vote | null;
}) {
  const [alias, setAlias] = useState<string | null>(null);
  const [isContributor, setIsContributor] = useState<boolean>(false);
  const { connected, wallet } = useWallet();

  const accessTokenPolicy =
    "e760308d0c14096ff479ec5f2495455505feb790503903fe976c4fd2";
  const projectId = "e0d1a30007bbbc2e4d3c9eb4ab2a5da0a1cd99f32928d1dae1e961e2";

  useEffect(() => {
    if (connected && wallet) {
      const checkAssets = async () => {
        const andamio = new AndamioSDK(
          "https://utxorpc.dolos.andamio.space:443",
          "Mainnet"
        );

        const assets = await wallet.getAssets();
        const accessToken = assets.find(
          (asset) => asset.policyId === accessTokenPolicy
        );
        if (!accessToken) {
          alert("You do not hold the required token to access this content.");
        } else {
          setAlias(hexToString(accessToken.unit.substring(62)));
          const utxo = await andamio.provider.core.globalState.getUtxoByAlias(
            hexToString(accessToken.unit.substring(62))
          );
          const blockfrostUtxo = andamio.utils.rpcUtxoToBlockfrostUtxo(utxo);
          const datum = parseDatumCbor(blockfrostUtxo.inline_datum as string);
          const credentials = datum.fields[2].list;
          const projectCredential = credentials.find(
            (cred: { fields: { bytes: string }[] }) =>
              cred.fields[0].bytes === projectId
          );
          if (!projectCredential) {
            alert("You do not hold the required project credential.");
          } else {
            setIsContributor(true);
          }
        }
      };
      checkAssets();
    }
  }, [connected, wallet, accessTokenPolicy, projectId]);

  const isEnabled = isContributor && alias;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <CardanoWalletWrapper />

        <div className="flex justify-center">
          <h1 className="text-3xl font-bold mb-4">
            {isEnabled ? (
              <>
                Welcome <i>{alias}</i>, Cast your vote!
              </>
            ) : (
              "Cast your vote!"
            )}
          </h1>
        </div>

        {!isEnabled && (
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

        <div
          className={`container mx-auto px-4 py-12 ${
            !isEnabled ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {govAction.category}
              </Badge>
              <h1 className="text-xl font-bold mb-4">{govAction.id}</h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link
                  href={`https://gov.tools/governance_actions/${govAction.id}`}
                  className="flex items-center gap-2"
                >
                  <LinkIcon className="h-4 w-4" /> GovTool
                </Link>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> days remaining
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/gov-actions/${govAction.id}/rationales-page`}
                    className="flex items-center gap-2"
                  >
                    <Scale className="h-4 w-4" /> Public Rationales
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Voting Form */}
                <VoteForm
                  govActionId={govAction.id}
                  existingVote={existingVote}
                  alias={alias || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
