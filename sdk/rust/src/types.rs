use alloy::primitives::{Address, U256};

#[derive(Debug, Clone)]
pub struct SwapParams {
    pub token_in: Address,
    pub token_out: Address,
    pub amount_in: U256,
    pub deadline: U256,
    pub min_amount_out: U256,
    pub recipient: Address,
}

#[derive(Debug, Clone)]
pub struct SwapResult {
    pub amount_out: U256,
    pub transaction_hash: alloy::primitives::FixedBytes<32>,
}
