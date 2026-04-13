---
sidebar_position: 1
title: Security
---

# Security & Operational Guidance

Evix is designed with minimal surface area and on-chain enforcement. This page covers best practices for secure integration.

## On-Chain Protections

The Evix contract enforces safety checks at the contract level - these cannot be bypassed by the SDK or caller:

| Protection | Mechanism | Error |
|-----------|-----------|-------|
| **Deadline enforcement** | Reverts if `block.timestamp > deadline` | `DeadlineExceeded()` |
| **Slippage protection** | Reverts if output < `minAmountOut` | `InsufficientOutput(amountOut, minAmountOut)` |
| **Input validation** | Reverts if `amountIn == 0` | `InvalidAmountIn()` |
| **Recipient validation** | Reverts if `recipient == address(0)` | `InvalidRecipient()` |
| **Pair access control** | Reverts if pair not allowlisted | `UnsupportedPair(tokenIn, tokenOut)` |

## Best Practices

### Always set `minAmountOut`

Never use `minAmountOut: 0` in production transactions. This leaves the swap completely unprotected against price movement and MEV. Set this value based on your own pricing model or oracle data.

```typescript
// Bad - no slippage protection
const result = await evix.swap({
  ...params,
  minAmountOut: 0n, // DANGEROUS in production
});

// Good - integrator sets minAmountOut from their own pricing
const result = await evix.swap({
  ...params,
  minAmountOut: 995_000n, // determined by integrator
});
```

### Use tight deadlines

Short deadlines prevent stale transactions from landing in unfavorable conditions.

| Use Case | Recommended Deadline |
|----------|---------------------|
| Trading bots | 15–30 seconds |
| Backend services | 30–60 seconds |
| User-facing flows | 60–120 seconds |

### Validate recipients

Ensure the `recipient` address is correctly derived and never user-controlled without validation. A malicious or incorrect recipient means tokens are sent to the wrong address with no recourse.

### Maintain deployment mappings

For multi-chain or multi-customer systems, maintain explicit configuration:

```typescript
const deployments: Record<string, EvixDeployment> = {
  "customer-a-base": {
    chainId: 8453,
    contractAddress: "0x...",
    supportedPairs: [["0x...", "0x..."]],
  },
  "customer-a-arbitrum": {
    chainId: 42161,
    contractAddress: "0x...",
    supportedPairs: [["0x...", "0x..."]],
  },
};
```

## Operational Guidance

### Token Approvals

Before swapping, the Evix contract must be approved to spend `tokenIn`:

```typescript
// Approve exact amount (recommended)
await walletClient.writeContract({
  address: tokenIn,
  abi: erc20Abi,
  functionName: "approve",
  args: [evixAddress, amountIn],
});
```

:::tip
Consider using exact approvals rather than `type(uint256).max` to minimize approval surface.
:::

### Error Handling

Handle all revert cases explicitly:

```typescript
try {
  const result = await evix.swap(params);
} catch (error) {
  if (error.message.includes("DeadlineExceeded")) {
    // Transaction was too slow - consider shorter deadlines
  } else if (error.message.includes("InsufficientOutput")) {
    // Price moved beyond tolerance - adjust minAmountOut and retry
  } else if (error.message.includes("UnsupportedPair")) {
    // Pair not enabled on this deployment - check configuration
  }
}
```

### Monitoring

For production integrations, monitor:

- **Swap events** - Track execution via the `Swap` event
- **Revert rates** - High revert rates indicate stale pricing or tight tolerances
- **Gas costs** - Monitor gas consumption across chains
