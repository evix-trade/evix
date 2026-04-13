---
sidebar_position: 99
title: FAQ
---

# FAQ

## General

### Is Evix a universal public router?

No. Evix is provisioned per customer and per chain. Each deployment is an independent contract instance with its own configuration, pair allowlist, and execution strategy.

### Is every deployment identical?

No. Deployments may differ in:
- Supported pairs
- Execution strategy and optimization profile
- Gas tuning
- Chain-specific behavior

### Who controls pair configuration?

Inductiv manages pair configuration. Enabling or disabling a pair requires updates on both the contract and the Evix system. Contact [Inductiv](https://inductiv.io) to request changes.

---

## Integration

### Can I integrate Evix from Solidity only?

Yes. The `IEvix` interface is a single function with six parameters. No SDK required for on-chain integrations.

```solidity
IEvix(evixAddress).swap(tokenIn, tokenOut, amountIn, deadline, minAmountOut, recipient);
```

### Which SDKs are available?

- **TypeScript** - built on viem ([source](https://github.com/evix-trade/evix/tree/master/sdk/typescript))
- **Rust** - built on alloy ([source](https://github.com/evix-trade/evix/tree/master/sdk/rust))

Both are reference implementations - use them as a starting point for your own integration.

### Do I need to simulate before executing?

No. Most integrators set `minAmountOut` based on their own pricing or oracle data and execute directly. `simulateSwap()` is available in the SDK if needed, but is not required.

### What chains are supported?

Evix can be deployed on any EVM-compatible chain. Deployments are provisioned per customer - contact [Inductiv](https://inductiv.io) for your specific chain requirements.

---

## Execution

### What happens if the deadline passes?

The transaction reverts with `DeadlineExceeded()`. No tokens are moved, no gas is consumed beyond the failed transaction.

### What happens if slippage exceeds my tolerance?

The transaction reverts with `InsufficientOutput(amountOut, minAmountOut)`. No tokens are moved.

### Can I swap any token pair?

Only pairs that have been explicitly enabled on your deployment. Use `getSupportedPairs()` to check which pairs are available. Attempting to swap an unsupported pair reverts with `UnsupportedPair(tokenIn, tokenOut)`.

### Do I need to approve the Evix contract?

Yes. The Evix contract uses `transferFrom` to pull `tokenIn` from the caller. You must approve the contract to spend your input token before swapping.

---

## Customization

### Is the system customizable?

Yes. Customization is a core part of the product model. Each deployment can be configured for specific pairs, execution profiles, gas strategies, and chain behavior.

### Can I request new pairs?

Yes. Contact Inductiv to enable additional pairs on your deployment.

### Can I have different configurations per chain?

Yes. Each chain deployment is independent and can be configured differently.
