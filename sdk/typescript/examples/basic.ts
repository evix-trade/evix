import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { EvixClient } from "@inductiv/evix-sdk";

const account = privateKeyToAccount("0x...");

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
  chainId: 8453,
  contractAddress: "0xYourEvixDeployment",
  publicClient,
  walletClient,
});

async function main() {
  // Simulate first
  const expectedOut = await evix.simulateSwap({
    tokenIn: "0xTokenIn",
    tokenOut: "0xTokenOut",
    amountIn: 1_000_000n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
    minAmountOut: 0n,
    recipient: account.address,
  });

  console.log("Expected output:", expectedOut);

  // Execute with slippage protection
  const { amountOut, transactionHash } = await evix.swap({
    tokenIn: "0xTokenIn",
    tokenOut: "0xTokenOut",
    amountIn: 1_000_000n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
    minAmountOut: (expectedOut * 995n) / 1000n, // 0.5% slippage
    recipient: account.address,
  });

  console.log("Swap executed:", { amountOut, transactionHash });
}

main().catch(console.error);
