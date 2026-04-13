---
sidebar_position: 1
title: Deployment Model
---

# Deployment Model

Evix is not a universal public router. Each customer integration is provisioned independently, per chain.

## Per Customer, Per Chain

Each deployment is an independent contract instance with its own:

- **Pair allowlist** - Only explicitly enabled pairs can be swapped
- **Execution strategy** - Optimized for the customer's specific use case
- **Owner address** - Controls pair configuration
- **Chain context** - Tuned for the target chain's gas and liquidity characteristics

## Why Isolated Deployments

| Benefit | Description |
|---------|-------------|
| **Environment isolation** | No cross-customer exposure or shared state |
| **Customization** | Pair focus, gas profiles, and execution behavior can differ per customer |
| **Controlled upgrades** | Roll out changes per customer without affecting others |
| **Security boundary** | A misconfiguration in one deployment cannot affect another |

## Customization Surface

Deployments may be configured around:

- **Chain-specific requirements** - Gas optimization, block time considerations
- **Pair allowlists** - Only enable the pairs the customer needs
- **Execution profile** - Optimize for speed vs. price improvement
- **Recipient handling** - Custom recipient validation rules
- **Integration-level safeguards** - Additional deployment-specific checks

### Client Profile

Deployment configuration is not manually specified. Inductiv generates a customer profile using ML models trained on the customer's trading history - covering asset focus, order frequency, and size distribution. This profile drives the execution strategy, quoter parameters, and aggregation behavior for the deployment.

The result is a deployment that is optimized for how this specific customer actually trades - not a generic configuration applied uniformly.

## What Integrators Should Expect

:::caution Assumptions to avoid
Production integrations should **not** assume:

- Universal pair support across all deployments
- Uniform gas profile across chains
- Identical behavior across customer deployments
- Interchangeable deployment addresses
:::

Each deployment is purpose-built. Treat configuration as structured metadata:

```typescript
type EvixDeployment = {
  customerId: string;
  chainId: number;
  contractAddress: `0x${string}`;
  supportedPairs: Array<[`0x${string}`, `0x${string}`]>;
  executionProfile: "speed" | "quality" | "balanced";
};
```

## Provisioning

To get an Evix deployment provisioned for your use case, contact [Inductiv](https://inductiv.io). The provisioning process includes:

1. **Chain selection** - Which chains you need deployments on
2. **Pair configuration** - Which token pairs to enable
3. **Execution tuning** - Optimization priorities for your use case
4. **Testing** - Simulation and integration testing on the target chain
5. **Go-live** - Production deployment with monitoring
