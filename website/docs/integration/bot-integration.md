---
sidebar_position: 3
title: Bot Integration
---

# Bot Integration

This guide shows how to process trade signals through Evix - a common pattern for automated trading bots.

## Full Example

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { EvixClient } from "./sdk";

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
  chainId: base.id,
  contractAddress: "0x...",
  publicClient,
  walletClient,
});

// Define a trade signal type
type TradeSignal = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  minAmountOut: bigint; // determined by integrator's pricing model
};

async function executeSignal(signal: TradeSignal) {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 30);

  const result = await evix.swap({
    tokenIn: signal.tokenIn,
    tokenOut: signal.tokenOut,
    amountIn: signal.amountIn,
    deadline,
    minAmountOut: signal.minAmountOut,
    recipient: account.address,
  });

  console.log(`Executed: ${result.transactionHash}`);
  return result;
}

// Process signals from a queue
async function main() {
  const signals: TradeSignal[] = [
    {
      tokenIn: "0x..." as `0x${string}`,
      tokenOut: "0x..." as `0x${string}`,
      amountIn: 500_000n,
      minAmountOut: 498_500n, // set by integrator
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
```

## Key Patterns

### Tight Deadlines

For bot integrations, use short deadlines (15–60 seconds). Stale transactions that land late can result in unfavorable execution.

```typescript
// 30-second deadline for latency-sensitive bots
const deadline = BigInt(Math.floor(Date.now() / 1000) + 30);
```

### Integrator-Determined `minAmountOut`

Each signal carries its own `minAmountOut`, determined by the integrator's pricing model, oracle, or execution strategy. Evix enforces this value on-chain.

### Error Isolation

Wrap each signal execution in a try/catch to prevent a single failure from halting the queue:

```typescript
for (const signal of signals) {
  try {
    await executeSignal(signal);
  } catch (err) {
    // Log and continue - don't let one bad signal halt the pipeline
    console.error("Signal execution failed:", err);
  }
}
```

## Considerations

| Concern | Recommendation |
|---------|---------------|
| **Deadline** | 15–60s for bots, shorter is better |
| **`minAmountOut`** | Set based on your own pricing - Evix enforces it on-chain |
| **Error handling** | Isolate per-signal, log failures, continue processing |
| **Concurrency** | Process signals sequentially per account to avoid nonce conflicts |
