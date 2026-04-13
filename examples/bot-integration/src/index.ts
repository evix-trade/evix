import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { EvixClient } from "@inductiv/evix-sdk";

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

type TradeSignal = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  maxSlippageBps: bigint;
};

async function executeSignal(signal: TradeSignal) {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 30);

  // Simulate to get expected output
  const expectedOut = await evix.simulateSwap({
    tokenIn: signal.tokenIn,
    tokenOut: signal.tokenOut,
    amountIn: signal.amountIn,
    deadline,
    minAmountOut: 0n,
    recipient: account.address,
  });

  const minOut =
    expectedOut - (expectedOut * signal.maxSlippageBps) / 10_000n;

  console.log(
    `Signal: ${signal.amountIn} in -> expected ${expectedOut} out (min: ${minOut})`
  );

  const result = await evix.swap({
    tokenIn: signal.tokenIn,
    tokenOut: signal.tokenOut,
    amountIn: signal.amountIn,
    deadline,
    minAmountOut: minOut,
    recipient: account.address,
  });

  console.log(`Executed: ${result.transactionHash}`);
  return result;
}

async function main() {
  // Example: process signals from a queue or event stream
  const signals: TradeSignal[] = [
    {
      tokenIn: "0x..." as `0x${string}`,
      tokenOut: "0x..." as `0x${string}`,
      amountIn: 500_000n,
      maxSlippageBps: 30n,
    },
  ];

  for (const signal of signals) {
    try {
      await executeSignal(signal);
    } catch (err) {
      console.error("Signal execution failed:", err);
    }
  }
}

main().catch(console.error);
