---
sidebar_position: 2
title: TypeScript SDK
---

# TypeScript SDK

The TypeScript SDK provides a reference implementation for interacting with Evix contracts using [viem](https://viem.sh). The source is available in the [repository](https://github.com/evix-trade/evix/tree/master/sdk/typescript) - use it as a starting point for your own integration.

## EvixClient

### Constructor

```typescript
import { EvixClient } from "./sdk";

const evix = new EvixClient(config: EvixClientConfig);
```

#### EvixClientConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `chainId` | `number` | Yes | Chain ID for the deployment |
| `contractAddress` | `` `0x${string}` `` | Yes | Evix contract address |
| `publicClient` | `PublicClient` | Yes | viem public client for reads |
| `walletClient` | `WalletClient` | No | viem wallet client for transaction execution |

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";

const evix = new EvixClient({
  chainId: base.id,
  contractAddress: "0x...",
  publicClient: createPublicClient({ chain: base, transport: http() }),
  walletClient: createWalletClient({ account, chain: base, transport: http() }),
});
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `chainId` | `number` | The chain ID (readonly) |
| `contractAddress` | `` `0x${string}` `` | The contract address (readonly) |

---

## Methods

### swap

Simulates and executes a swap. Requires a `walletClient`.

```typescript
const result: SwapResult = await evix.swap(params: SwapParams);
```

**Returns:** `SwapResult`

| Field | Type | Description |
|-------|------|-------------|
| `amountOut` | `bigint` | Actual output amount |
| `transactionHash` | `` `0x${string}` `` | Transaction hash |

**Throws:** `Error` if `walletClient` is not configured.

**Example:**

```typescript
const result = await evix.swap({
  tokenIn: "0x...",
  tokenOut: "0x...",
  amountIn: 1_000_000n,
  deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
  minAmountOut: 990_000n,
  recipient: "0x...",
});

console.log(result.amountOut);         // 995_230n
console.log(result.transactionHash);   // "0xabc..."
```

---

### simulateSwap (optional)

Simulates a swap via `eth_call` without broadcasting. Does not require a `walletClient`. Most integrators will set `minAmountOut` based on their own pricing - use this only if you need an on-chain preview.

```typescript
const amountOut: bigint = await evix.simulateSwap(params: SwapParams);
```

**Returns:** `bigint` - the expected output amount.

---

### populateSwap

Builds a transaction request without broadcasting - useful for smart account batching or custom signers.

```typescript
const request = await evix.populateSwap(params: SwapParams);
```

**Returns:** A viem contract write request object containing `to`, `data`, `value`, `gas`, etc.

**Example:**

```typescript
const request = await evix.populateSwap({
  tokenIn: "0x...",
  tokenOut: "0x...",
  amountIn: 1_000_000n,
  deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
  minAmountOut: 995_000n,
  recipient: "0x...",
});

// Pass to a smart account SDK, relay, or custom signer
```

---

## Types

### SwapParams

```typescript
type SwapParams = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  deadline: bigint;
  minAmountOut: bigint;
  recipient: `0x${string}`;
};
```

### SwapResult

```typescript
type SwapResult = {
  amountOut: bigint;
  transactionHash: `0x${string}`;
};
```

### EvixClientConfig

```typescript
type EvixClientConfig = {
  chainId: number;
  contractAddress: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
};
```

---

## Exported ABI

The contract ABI is exported for direct use with viem:

```typescript
import { evixAbi } from "./sdk";
import { encodeFunctionData } from "viem";

const calldata = encodeFunctionData({
  abi: evixAbi,
  functionName: "swap",
  args: [tokenIn, tokenOut, amountIn, deadline, minAmountOut, recipient],
});
```
