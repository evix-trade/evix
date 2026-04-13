---
sidebar_position: 4
title: Smart Account
---

# Smart Account Integration

This guide shows how to generate Evix swap calldata for smart account batching - useful when you need to build transactions without broadcasting them directly.

## Full Example

```typescript
import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { EvixClient, evixAbi } from "./sdk";

const EVIX_ADDRESS = "0x..." as `0x${string}`;

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// No walletClient needed - we're only building calldata
const evix = new EvixClient({
  chainId: base.id,
  contractAddress: EVIX_ADDRESS,
  publicClient,
});

async function main() {
  const TOKEN_IN = "0x..." as `0x${string}`;
  const TOKEN_OUT = "0x..." as `0x${string}`;
  const SMART_ACCOUNT = "0x..." as `0x${string}`;

  // Option 1: Use populateSwap to get a transaction request
  const request = await evix.populateSwap({
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: 1_000_000n,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
    minAmountOut: 995_000n,
    recipient: SMART_ACCOUNT,
  });

  console.log("Transaction request:", request);

  // Option 2: Encode calldata directly for custom pipelines
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
```

## Methods

### `populateSwap()`

Returns a full transaction request object (simulated on-chain) without broadcasting. The returned request can be passed to any signer or batching system.

```typescript
const request = await evix.populateSwap(params);
// request contains: to, data, value, gas, etc.
```

**Use when:** You want viem to simulate and build the request for you.

### Direct Calldata Encoding

Use `encodeFunctionData` with the exported `evixAbi` to encode raw calldata. No simulation, no provider interaction.

```typescript
import { encodeFunctionData } from "viem";
import { evixAbi } from "./sdk";

const calldata = encodeFunctionData({
  abi: evixAbi,
  functionName: "swap",
  args: [tokenIn, tokenOut, amountIn, deadline, minAmountOut, recipient],
});
```

**Use when:** You need calldata for a custom pipeline, relay, or multi-call batch.

### Rust Calldata Encoding

The Rust SDK provides `encode_swap()` for the same purpose:

```rust
use evix_sdk::{EvixClient, SwapParams};
use alloy::primitives::{address, U256};

let client = EvixClient::new(8453, address!("0x..."));

let params = SwapParams {
    token_in: address!("0x..."),
    token_out: address!("0x..."),
    amount_in: U256::from(1_000_000u64),
    deadline: U256::from(1700000000u64),
    min_amount_out: U256::from(995_000u64),
    recipient: address!("0x..."),
};

let calldata = client.encode_swap(&params);
```

## Batching Pattern

A common pattern is to batch an ERC-20 approval and an Evix swap together in a single smart account transaction:

```typescript
const approveCalldata = encodeFunctionData({
  abi: erc20Abi,
  functionName: "approve",
  args: [EVIX_ADDRESS, amountIn],
});

const swapCalldata = encodeFunctionData({
  abi: evixAbi,
  functionName: "swap",
  args: [tokenIn, tokenOut, amountIn, deadline, minAmountOut, recipient],
});

// Submit as a batch via your smart account SDK
const batch = [
  { to: TOKEN_IN, data: approveCalldata, value: 0n },
  { to: EVIX_ADDRESS, data: swapCalldata, value: 0n },
];
```

:::tip
When batching, ensure the approval happens before the swap in the batch sequence. Most smart account SDKs execute batched calls sequentially.
:::
