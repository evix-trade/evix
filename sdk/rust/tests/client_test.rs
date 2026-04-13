use alloy::primitives::{address, U256};
use evix_sdk::{EvixClient, SwapParams};

#[test]
fn test_client_creation() {
    let client = EvixClient::new(
        8453,
        address!("0x1234567890123456789012345678901234567890"),
    );
    assert_eq!(client.chain_id, 8453);
}

#[test]
fn test_encode_swap() {
    let client = EvixClient::new(
        8453,
        address!("0x1234567890123456789012345678901234567890"),
    );

    let params = SwapParams {
        token_in: address!("0x1111111111111111111111111111111111111111"),
        token_out: address!("0x2222222222222222222222222222222222222222"),
        amount_in: U256::from(1000u64),
        deadline: U256::from(9999999999u64),
        min_amount_out: U256::from(900u64),
        recipient: address!("0x3333333333333333333333333333333333333333"),
    };

    let calldata = client.encode_swap(&params);
    assert!(!calldata.is_empty());
}

#[tokio::test]
async fn test_swap_without_provider() {
    let client = EvixClient::new(
        8453,
        address!("0x1234567890123456789012345678901234567890"),
    );

    let params = SwapParams {
        token_in: address!("0x1111111111111111111111111111111111111111"),
        token_out: address!("0x2222222222222222222222222222222222222222"),
        amount_in: U256::from(1000u64),
        deadline: U256::from(9999999999u64),
        min_amount_out: U256::from(900u64),
        recipient: address!("0x3333333333333333333333333333333333333333"),
    };

    let result = client.swap(params).await;
    assert!(result.is_err());
}
