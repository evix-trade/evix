---
sidebar_position: 2
title: Architecture
---

# Architecture

Evix is structured around a minimal, auditable contract surface with deployment-level customization. Each customer integration is provisioned independently - there is no universal public router.

## System Design

**Trading Bot / Frontend** → **Evix SDK** (TypeScript / Rust) → **Evix Contract** (per-customer, per-chain)

The contract processes each swap through three layers in sequence:

| Step | Layer | Role |
|------|-------|------|
| 1 | **Validation** | Checks deadline, pair allowlist, amount, and recipient |
| 2 | **Route Optimization** | Determines optimal trade aggregation across available liquidity sources |
| 3 | **Execution Engine** | Executes the optimized route with minimal gas overhead |
| 4 | **Protection** | Enforces `minAmountOut` - reverts if output is insufficient |

After all three layers pass, `amountOut` and tokens are delivered to the recipient.

## Core Components

### Evix Contract

The on-chain execution contract with a single entry point:

```solidity
function swap(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 deadline,
    uint256 minAmountOut,
    address recipient
) external payable returns (uint256 amountOut);
```

The contract enforces the following checks **before and after execution**:

| Check | When | Reverts With |
|-------|------|-------------|
| Deadline not exceeded | Before execution | `DeadlineExceeded()` |
| Amount is non-zero | Before execution | `InvalidAmountIn()` |
| Recipient is valid | Before execution | `InvalidRecipient()` |
| Pair is supported | Before execution | `UnsupportedPair(tokenIn, tokenOut)` |
| Output meets minimum | After execution | `InsufficientOutput(amountOut, minAmountOut)` |

### Execution Engine

The `_execute()` function is the deployment-specific component. Each customer deployment overrides this with their configured strategy - optimized for their specific pairs, chains, and execution requirements.

```solidity
function _execute(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
) internal virtual returns (uint256 amountOut);
```

This is where Evix differs from a generic router: execution logic is **not one-size-fits-all**. It is tuned per deployment.

### Pair Access Control

Pairs are allowlisted per deployment. Only explicitly enabled pairs can be swapped - attempting an unsupported pair reverts with `UnsupportedPair`. Use `getSupportedPairs()` to query which pairs are available.

Pair configuration is managed by Inductiv. To request new pairs, contact [Inductiv](https://inductiv.io).

### Quoter

The Evix quoter has two layers: an on-chain component that returns quotes at execution time, and an off-chain component that maintains it with real-time pool state updates. The quoter is the decision layer - the router executes what the quoter determines.

Quoter configuration is derived from the customer's ML-generated client profile. See [Execution Intelligence](/execution-intelligence) for details.

## SDK Layer

The SDK provides a thin abstraction over the contract interface, available in TypeScript and Rust:

| Method | Description |
|--------|-------------|
| `swap()` | Execute a swap with a wallet client |
| `simulateSwap()` | Optional - preview execution result via `eth_call` |
| `populateSwap()` | Build a transaction request without broadcasting |
| `encodeSwap()` | Encode calldata for custom pipelines (Rust) |
| `getSupportedPairs()` | Query which token pairs are enabled on the deployment |

The SDK does **not** add routing, quoting, or off-chain logic. It is a typed, validated wrapper around the contract.

## Design Principles

1. **Minimal surface area** - One function, six parameters. Nothing to misconfigure.
2. **On-chain verification** - All safety checks happen in the contract, not the SDK.
3. **Deployment isolation** - No shared state between customers or chains.
4. **Strategy flexibility** - Execution logic is configurable per deployment.
5. **SDK transparency** - The SDK generates contract calls. It does not introduce hidden behavior.

## Gas Overhead

Evix is designed to minimize on-chain overhead. Gas consumption scales with execution complexity:

| Scenario | Overhead |
|---|---|
| **Standard execution** | ~9,000 gas on top of the base swap |
| **Complex execution** | Up to ~50,000 gas |

Overhead is additive to the gas cost of the underlying swap. Simple, well-configured deployments targeting liquid pairs will consistently sit at the lower end of this range.
