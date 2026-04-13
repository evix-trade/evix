# Evix

### Real-Time Execution Infrastructure by Inductiv

## Overview

Evix is a customizable execution layer for on-chain trading, built for participants that care about execution quality, low latency, and reduced order flow exposure.

Unlike traditional aggregators that depend on external backends for route computation and quote generation, Evix is designed to deliver real-time execution through a deployment model tailored to each customer and each chain.

Evix is built for integrators that want a swap interface that is simple to adopt, operationally flexible, and adaptable to specific trading environments without forcing a one-size-fits-all architecture.

## Why Evix

On-chain trading systems still face two structural problems:

### Backend Dependency

Many aggregators and trading terminals rely on external infrastructure to generate routes or execute user flow. This introduces avoidable latency and exposes valuable order flow to third parties.

For sophisticated flow owners and latency-sensitive traders, this is not just a UX issue. It is an execution issue.

### Stale Pricing

In most systems, the quote is generated before execution. By the time the transaction lands, the market may have moved and the result no longer reflects the best available path.

Evix is designed to reduce both problems by making execution itself the center of the integration model.

## Who Should Integrate Evix

- **On-Chain HFT Participants** — Execution-sensitive actors that optimize for both high-quality fills and low latency.
- **Privacy-Conscious Traders and Platforms** — Users and applications that want to avoid exposing order flow to an external backend.
- **MEV-Aware Integrators** — Protocols, desks, and trading systems that understand the cost of information leakage and want tighter execution control.
- **Custom Trading Environments** — Teams that require deployment isolation, chain-specific behavior, pair-specific tuning, and configurable gas versus efficiency tradeoffs.

## Core Product Characteristics

- Deployment per customer, per chain
- Fully customizable execution environment
- Minimal smart contract integration surface
- SDK support for TypeScript and Rust
- Designed for pair-aware and profile-aware configuration
- Built for low-latency, execution-focused integrations

## Architecture

Evix follows a dedicated deployment model. Each integration is provisioned per customer and per chain, allowing the execution environment to be configured around the integrator's specific requirements.

This can include:

- Supported trading pairs
- Recipient behavior
- Gas versus efficiency preferences
- Strategy-specific execution tuning
- Environment-specific safeguards

## Integration Types

### 1. Direct Contract Integration

For protocols, routers, vaults, and on-chain systems that want to call Evix directly from Solidity.

### 2. TypeScript SDK Integration

For frontends, bots, API services, trading terminals, and wallet-connected applications.

### 3. Rust SDK Integration

For high-performance trading systems, low-latency services, and infrastructure-level integrations.

## Getting Started

1. Define the target chain or chains
2. Define the expected trading pairs and execution profile
3. Receive the dedicated deployment details
4. Integrate through Solidity, TypeScript, or Rust
5. Run simulation and production validation
6. Move into controlled rollout

## Repository Structure

```
evix/
├── core/           # Solidity contracts (execution layer)
├── sdk/
│   ├── typescript/ # TypeScript SDK
│   └── rust/       # Rust SDK
├── website/        # Documentation site
├── deployments/    # Deployment metadata
└── examples/       # End-to-end integration examples
```

## About Inductiv

Inductiv builds execution infrastructure for on-chain markets, focused on latency-sensitive systems, high-quality execution, and architecture that minimizes unnecessary trust assumptions.

Evix is part of this product suite and is designed for customers that need a dedicated, configurable execution environment rather than a generic routing product.
