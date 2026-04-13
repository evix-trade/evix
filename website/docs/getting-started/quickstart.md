---
sidebar_position: 1
title: Quickstart
---

# Quickstart

Get a swap running through Evix in under 5 minutes.

## Prerequisites

- A provisioned Evix deployment address for your chain
- An RPC endpoint for the target chain
- A wallet with token balances and approvals

:::info
Evix deployments are provisioned per customer, per chain. Contact [Inductiv](https://inductiv.io) to get your deployment set up.
:::

## 1. Get the SDK

The SDK source is available in the [GitHub repository](https://github.com/evix-trade/evix/tree/master/sdk). Use the TypeScript or Rust reference implementation as a starting point for your integration.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 2. Initialize the Client

<Tabs>
<TabItem value="ts" label="TypeScript" default>

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
  contractAddress: "0x...", // Your Evix deployment
  publicClient,
  walletClient,
});
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use alloy::primitives::address;
use evix_sdk::EvixClient;

let client = EvixClient::new(
    8453, // Base chain ID
    address!("0x1234567890123456789012345678901234567890"),
);
```

</TabItem>
</Tabs>

## 3. Execute a Swap

The integrator provides `minAmountOut` based on their own pricing or oracle data. Evix enforces this value on-chain.

<Tabs>
<TabItem value="ts" label="TypeScript" default>

```typescript
const TOKEN_IN  = "0x..." as `0x${string}`; // e.g. USDC
const TOKEN_OUT = "0x..." as `0x${string}`; // e.g. WETH
const AMOUNT_IN = 1_000_000n;               // 1 USDC (6 decimals)

const result = await evix.swap({
  tokenIn: TOKEN_IN,
  tokenOut: TOKEN_OUT,
  amountIn: AMOUNT_IN,
  deadline: BigInt(Math.floor(Date.now() / 1000) + 120),
  minAmountOut: 390_000_000_000_000n, // set by integrator
  recipient: account.address,
});

console.log("Swap executed:", {
  amountOut: result.amountOut.toString(),
  tx: result.transactionHash,
});
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use alloy::primitives::{address, U256};
use evix_sdk::SwapParams;

let params = SwapParams {
    token_in: address!("0x1111111111111111111111111111111111111111"),
    token_out: address!("0x2222222222222222222222222222222222222222"),
    amount_in: U256::from(1_000_000u64),
    deadline: U256::from(1700000000u64),
    min_amount_out: U256::from(995_000u64), // set by integrator
    recipient: address!("0x3333333333333333333333333333333333333333"),
};

let calldata = client.encode_swap(&params);
```

</TabItem>
</Tabs>

:::tip
For production use, keep deadlines tight (30–120 seconds) and always set a non-zero `minAmountOut`. See the [Security guide](/security/overview) for more best practices.
:::

## Next Steps

- [Installation](/getting-started/installation) - SDK setup details and configuration
- [Basic Swap Guide](/integration/basic-swap) - Full walkthrough with explanations
- [API Reference](/api/contract) - Complete contract and SDK documentation
