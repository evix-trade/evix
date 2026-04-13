// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IEvix {
    /// @notice Executes a swap through the Evix execution layer.
    /// @param tokenIn The input token address.
    /// @param tokenOut The output token address.
    /// @param amountIn The exact amount of tokenIn to swap.
    /// @param deadline Unix timestamp after which the transaction must revert.
    /// @param minAmountOut Minimum acceptable output amount.
    /// @param recipient Address that receives the output tokens.
    /// @return amountOut The final output amount delivered to the recipient.
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline,
        uint256 minAmountOut,
        address recipient
    ) external payable returns (uint256 amountOut);
}
