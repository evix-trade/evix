import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { EvixClient } from "@inductiv/evix-sdk";

// Replace with your actual private key and deployment address
const PRIVATE_KEY = "0x..." as `0x${string}`;
const EVIX_ADDRESS = "0x..." as `0x${string}`;

const account = privateKeyToAccount(PRIVATE_KEY);

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

const evix = new EvixClient({
  chainId: base.id,
  contractAddress: EVIX_ADDRESS,
  publicClient,
  walletClient,
});

async function main() {
  const TOKEN_IN = "0x..." as `0x${string}`;
  const TOKEN_OUT = "0x..." as `0x${string}`;
  const AMOUNT_IN = 1_000_000n;

  // Step 1: Simulate
  const expectedOut = await evix.simulateSwap({
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: AMOUNT_IN,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
    minAmountOut: 0n,
    recipient: account.address,
  });

  console.log("Simulated output:", expectedOut.toString());

  // Step 2: Execute with slippage
  const slippageBps = 50n; // 0.5%
  const minOut = expectedOut - (expectedOut * slippageBps) / 10_000n;

  const result = await evix.swap({
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: AMOUNT_IN,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
    minAmountOut: minOut,
    recipient: account.address,
  });

  console.log("Swap executed:", {
    amountOut: result.amountOut.toString(),
    tx: result.transactionHash,
  });
}

main().catch(console.error);
