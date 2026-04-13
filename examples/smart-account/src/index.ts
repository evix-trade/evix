import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { EvixClient, evixAbi } from "@inductiv/evix-sdk";

const EVIX_ADDRESS = "0x..." as `0x${string}`;

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const evix = new EvixClient({
  chainId: base.id,
  contractAddress: EVIX_ADDRESS,
  publicClient,
});

async function main() {
  const TOKEN_IN = "0x..." as `0x${string}`;
  const TOKEN_OUT = "0x..." as `0x${string}`;
  const SMART_ACCOUNT = "0x..." as `0x${string}`;

  // Use populateSwap to get the transaction request
  // without broadcasting — suitable for smart account batching
  const request = await evix.populateSwap({
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: 1_000_000n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
    minAmountOut: 995_000n,
    recipient: SMART_ACCOUNT,
  });

  console.log("Transaction request for smart account batch:", request);

  // Alternatively, encode calldata directly for custom pipelines
  const calldata = encodeFunctionData({
    abi: evixAbi,
    functionName: "swap",
    args: [
      TOKEN_IN,
      TOKEN_OUT,
      1_000_000n,
      BigInt(Math.floor(Date.now() / 1000) + 120),
      995_000n,
      SMART_ACCOUNT,
    ],
  });

  console.log("Encoded calldata:", calldata);
}

main().catch(console.error);
