# evix-sdk (Rust)

Rust SDK for the Evix execution layer.

## Usage

```rust
use evix_sdk::{EvixClient, SwapParams};
use alloy::primitives::{address, U256};

let client = EvixClient::new(8453, address!("0xYourEvixDeployment"));

let params = SwapParams {
    token_in: address!("0xTokenIn"),
    token_out: address!("0xTokenOut"),
    amount_in: U256::from(1_000_000u64),
    deadline: U256::from(1700000000u64),
    min_amount_out: U256::from(995_000u64),
    recipient: address!("0xRecipient"),
};

let result = client.swap(params).await?;
```

## Methods

- `swap(params)` — Executes a swap transaction.
- `simulate_swap(params)` — Simulates the swap without broadcasting.
- `encode_swap(params)` — Returns encoded calldata for the swap.
