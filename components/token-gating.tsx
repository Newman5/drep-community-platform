"use client";

import { AssetExtended, bytesToHex, hexToString } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import AndamioSDK, { Utxo } from "@andamiojs/sdk";

export default function TokenGating() {
  const [alias, setAlias] = useState<string | null>(null);
  const [isContributor, setIsContributor] = useState<boolean>(false);
  const { connected, wallet } = useWallet();

  const andamio = new AndamioSDK(
    "https://utxorpc.dolos.andamio.space:443",
    "Mainnet"
  );

  const accessTokenPolicy =
    "e760308d0c14096ff479ec5f2495455505feb790503903fe976c4fd2";
  const projectId = "db22e013578fcead6c2fed5446d61891ad31f3cb4955e88d980107e7";

  useEffect(() => {
    if (connected && wallet) {
      const checkAssets = async () => {
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
          const datum = utxo.parsedValued?.datum
            ?.payload as unknown as GlobalStateDatum;
          const credentials = datum.plutusData.value.fields[2].plutusData.value
            .items as unknown as Credentials[];
          const projectCredential = credentials.find(
            (cred) =>
              bytesToHex(
                cred.plutusData.value.fields[0].plutusData
                  .value as unknown as ArrayBuffer
              ) === projectId
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
  }, [connected, wallet]);

  if (!connected) {
    return <div>Please connect your wallet to access this content.</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(alias, null, 2)}</pre>
      {/* <pre>{JSON.stringify(credentials, null, 2)}</pre> */}
      <pre>{JSON.stringify(isContributor, null, 2)}</pre>
    </div>
  );
}

type Credentials = {
  plutusData: {
    case: "constr";
    value: {
      constructor: number; // 121
      fields: [
        {
          plutusData: {
            case: "boundedBytes";
            value: Uint8Array;
          };
        },
        {
          plutusData: {
            case: "array";
            value: {
              items: {
                plutusData: {
                  case: "boundedBytes";
                  value: Uint8Array;
                };
              }[]; // []
            };
          };
        },
        {
          plutusData: {
            case: "constr";
            value: {
              constructor: number; // 122
              fields: []; // []
            };
          };
        }
      ];
    };
  };
};

type GlobalStateDatum = {
  plutusData: {
    case: "constr";
    value: {
      constructor: number; // usually the same as tag
      fields: [
        {
          plutusData: {
            case: "boundedBytes";
            value: Uint8Array;
          };
        },
        {
          plutusData: {
            case: "boundedBytes";
            value: Uint8Array;
          };
        },
        {
          plutusData: {
            case: "array";
            value: {
              items: Credentials[];
            };
          };
        },
        {
          plutusData: {
            case: "boundedBytes";
            value: Uint8Array;
          };
        }
      ];
    };
  };
};
