# @inductiv/evix-sdk

TypeScript SDK for the Evix execution layer.

## Installation

```bash
npm install @inductiv/evix-sdk
```

## Usage

```ts
import { EvixClient } from "@inductiv/evix-sdk";

const evix = new EvixClient({
  chainId: 8453,
  contractAddress: "0xYourEvixDeployment",
  publicClient,
  walletClient,
});

const { amountOut, transactionHash } = await evix.swap({
  tokenIn: "0xTokenIn",
  tokenOut: "0xTokenOut",
  amountIn: 1_000_000n,
  deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
  minAmountOut: 995_000n,
  recipient: "0xRecipient",
});
```

## Methods

- `swap(params)` — Builds and submits a swap transaction.
- `populateSwap(params)` — Returns transaction data without broadcasting.
- `simulateSwap(params)` — Runs a pre-execution simulation.
