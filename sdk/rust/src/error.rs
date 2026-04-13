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
