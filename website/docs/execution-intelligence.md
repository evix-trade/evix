---
sidebar_position: 5
---

# Execution Intelligence

Evix deployments are not generic. Each customer deployment is optimized around a structured profile derived from their actual trading behavior - assets traded, order frequency, and order size distribution.

## Client Profile

Before a deployment is provisioned, Inductiv runs ML models over the customer's trading history to generate a client profile. This profile captures:

- **Asset focus** - which token pairs are actively traded
- **Order frequency** - how often swaps occur and at what intervals
- **Order size distribution** - typical and outlier trade sizes

The profile is the foundation for all deployment configuration decisions.

## Quoter Architecture

The Evix quoter operates across two layers:

- **On-chain component** - returns quotes the router can trust at execution time
- **Off-chain component** - receives real-time updates on pool states, new pools, and market conditions, and uses these to keep the on-chain component current

This architecture ensures that quotes reflect actual market conditions at the time of execution, not a stale snapshot from seconds earlier.

## Optimization Objective

Every configuration decision - routing strategy, aggregation behavior, quoter parameters - is oriented around a single objective: **maximizing net value retained by the customer**.

This means balancing execution quality against transaction costs. The optimal configuration is not the same for a high-frequency small-order flow as it is for a low-frequency large-order flow. The client profile determines where that balance sits.

## Monitoring

Production deployments are monitored continuously. The monitoring layer validates that execution behavior stays within the parameters defined at configuration time. Deviations - in quote quality, error rates, or execution outcomes - are detected and surfaced in real time.

This ensures that the deployment performs as designed across changing market conditions.
