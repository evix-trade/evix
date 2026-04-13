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

    // Encode calldata (works without a provider)
    let calldata = client.encode_swap(&params);
    println!("Encoded calldata length: {}", calldata.len());

    // Swap requires a configured provider
    match client.swap(params).await {
        Ok(result) => println!("Swap result: {:?}", result),
        Err(e) => println!("Expected error (no provider): {}", e),
    }
}
