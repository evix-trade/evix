use alloy::primitives::{Address, U256};
use alloy::sol;

use crate::error::EvixError;
use crate::types::{SwapParams, SwapResult};

sol! {
    #[sol(rpc)]
    interface IEvix {
        function swap(
            address tokenIn,
            address tokenOut,
            uint256 amountIn,
            uint256 deadline,
            uint256 minAmountOut,
            address recipient
        ) external payable returns (uint256 amountOut);
    }
}

#[derive(Debug, Clone)]
pub struct EvixClient {
    pub chain_id: u64,
    pub contract_address: Address,
}

impl EvixClient {
    pub fn new(chain_id: u64, contract_address: Address) -> Self {
        Self {
            chain_id,
            contract_address,
        }
    }

    /// Builds the calldata for a swap without executing it.
    pub fn encode_swap(&self, params: &SwapParams) -> Vec<u8> {
        let call = IEvix::swapCall {
            tokenIn: params.token_in,
            tokenOut: params.token_out,
            amountIn: params.amount_in,
            deadline: params.deadline,
            minAmountOut: params.min_amount_out,
            recipient: params.recipient,
        };
        alloy::sol_types::SolCall::abi_encode(&call)
    }

    /// Placeholder for swap execution.
    /// In production, this would use an alloy provider to send the transaction.
    pub async fn swap(&self, _params: SwapParams) -> Result<SwapResult, EvixError> {
        // Production implementation would:
        // 1. Encode the swap calldata
        // 2. Build the transaction
        // 3. Send via the provider
        // 4. Wait for receipt and decode the return value
        Err(EvixError::ContractError(
            "swap requires a configured provider — see examples".into(),
        ))
    }

    /// Placeholder for swap simulation.
    pub async fn simulate_swap(&self, _params: SwapParams) -> Result<U256, EvixError> {
        Err(EvixError::SimulationError(
            "simulate_swap requires a configured provider — see examples".into(),
        ))
    }
}
