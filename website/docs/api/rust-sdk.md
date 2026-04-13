---
sidebar_position: 3
title: Rust SDK
---

# Rust SDK

The Rust SDK provides a reference implementation for building Evix swap transactions using [alloy](https://github.com/alloy-rs/alloy). The source is available in the [repository](https://github.com/evix-trade/evix/tree/master/sdk/rust) - use it as a starting point for your own integration.

## EvixClient

### Constructor

```rust
use alloy::primitives::address;
use evix_sdk::EvixClient;

let client = EvixClient::new(
    8453,                                                       // chain_id
    address!("0x1234567890123456789012345678901234567890"),       // contract_address
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `chain_id` | `u64` | Chain ID for the deployment |
| `contract_address` | `Address` | Evix contract address |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `chain_id` | `u64` | The chain ID |
| `contract_address` | `Address` | The contract address |

---

## Methods

### encode_swap

Encodes swap calldata without executing. Works without a provider - useful for building transactions in custom pipelines.

```rust
pub fn encode_swap(&self, params: &SwapParams) -> Vec<u8>
```

**Returns:** ABI-encoded calldata as a byte vector.

**Example:**

```rust
use alloy::primitives::{address, U256};
use evix_sdk::{EvixClient, SwapParams};

let client = EvixClient::new(
    8453,
    address!("0x1234567890123456789012345678901234567890"),
);

let params = SwapParams {
    token_in: address!("0x1111111111111111111111111111111111111111"),
    token_out: address!("0x2222222222222222222222222222222222222222"),
    amount_in: U256::from(1_000_000u64),
    deadline: U256::from(1700000000u64),
    min_amount_out: U256::from(995_000u64),
    recipient: address!("0x3333333333333333333333333333333333333333"),
};

let calldata = client.encode_swap(&params);
println!("Calldata length: {}", calldata.len()); // 196 bytes
```

---

### swap

Executes a swap. Requires a configured provider (not included in the base SDK - see examples for provider setup).

```rust
pub async fn swap(&self, params: SwapParams) -> Result<SwapResult, EvixError>
```

---

### simulate_swap

Simulates a swap via `eth_call`. Requires a configured provider.

```rust
pub async fn simulate_swap(&self, params: SwapParams) -> Result<U256, EvixError>
```

---

## Types

### SwapParams

```rust
#[derive(Debug, Clone)]
pub struct SwapParams {
    pub token_in: Address,
    pub token_out: Address,
    pub amount_in: U256,
    pub deadline: U256,
    pub min_amount_out: U256,
    pub recipient: Address,
}
```

### SwapResult

```rust
#[derive(Debug, Clone)]
pub struct SwapResult {
    pub amount_out: U256,
    pub transaction_hash: FixedBytes<32>,
}
```

### EvixError

```rust
#[derive(Debug, thiserror::Error)]
pub enum EvixError {
    #[error("contract call failed: {0}")]
    ContractError(String),

    #[error("transaction failed: {0}")]
    TransactionError(String),

    #[error("simulation failed: {0}")]
    SimulationError(String),

    #[error("provider error: {0}")]
    ProviderError(String),
}
```

---

## Full Example

```rust
use alloy::primitives::{address, U256};
use evix_sdk::{EvixClient, SwapParams};

#[tokio::main]
async fn main() {
    let client = EvixClient::new(
        8453,
        address!("0x1234567890123456789012345678901234567890"),
    );

    let params = SwapParams {
        token_in: address!("0x1111111111111111111111111111111111111111"),
        token_out: address!("0x2222222222222222222222222222222222222222"),
        amount_in: U256::from(1_000_000u64),
        deadline: U256::from(1700000000u64),
        min_amount_out: U256::from(995_000u64),
        recipient: address!("0x3333333333333333333333333333333333333333"),
    };

    // Encode calldata (no provider needed)
    let calldata = client.encode_swap(&params);
    println!("Encoded calldata length: {}", calldata.len());

    // Execute (requires provider - see deployment docs)
    match client.swap(params).await {
        Ok(result) => println!("Swap result: {:?}", result),
        Err(e) => eprintln!("Error: {}", e),
    }
}
```
