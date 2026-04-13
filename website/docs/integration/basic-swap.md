---
sidebar_position: 2
title: Basic Swap
---

# Basic Swap

This guide walks through a complete swap using the TypeScript SDK - from client setup to execution.

## Full Example

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { EvixClient } from "./sdk";

// 1. Setup
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

// 2. Define swap parameters
const TOKEN_IN = "0x..." as `0x${string}`;
const TOKEN_OUT = "0x..." as `0x${string}`;
const AMOUNT_IN = 1_000_000n;

async function main() {
  // 3. Execute the swap with your own minAmountOut
  const result = await evix.swap({
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: AMOUNT_IN,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
    minAmountOut: 995_000n, // set by integrator based on own pricing
    recipient: account.address,
  });

  console.log("Swap executed:", {
    amountOut: result.amountOut.toString(),
    tx: result.transactionHash,
  });
}

main().catch(console.error);
```

## Step-by-Step Breakdown

### 1. Client Setup

The `EvixClient` requires:
- **`chainId`** - The chain ID for your deployment (e.g. `8453` for Base)
- **`contractAddress`** - Your provisioned Evix deployment address
- **`publicClient`** - A viem `PublicClient` for reads
- **`walletClient`** - A viem `WalletClient` for transaction execution

### 2. Setting `minAmountOut`

The integrator is responsible for determining `minAmountOut` based on their own pricing, oracle data, or execution model. Evix enforces this value on-chain - if the actual output is lower, the transaction reverts.

### 3. Execution

`swap()` submits the transaction and returns the actual output amount and the transaction hash.

:::caution
Ensure the wallet has sufficient token balance **and** that the Evix contract has been approved to spend `tokenIn` via `ERC20.approve()`.
:::

## Token Approval

Before your first swap, approve the Evix contract to spend your input token:

```typescript
import { erc20Abi } from "viem";

const approveTx = await walletClient.writeContract({
  address: TOKEN_IN,
  abi: erc20Abi,
  functionName: "approve",
  args: [EVIX_ADDRESS, AMOUNT_IN],
});
```

## Error Handling

```typescript
try {
  const result = await evix.swap(params);
} catch (error) {
  // Common revert reasons:
  // - DeadlineExceeded: Transaction landed after deadline
  // - InsufficientOutput: Market moved beyond slippage tolerance
  // - UnsupportedPair: Pair not allowlisted on this deployment
  // - InvalidAmountIn: Zero input amount
  // - InvalidRecipient: Zero address recipient
  console.error("Swap failed:", error);
}
```
