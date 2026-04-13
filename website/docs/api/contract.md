---
sidebar_position: 1
title: Contract Interface
---

# Contract Interface

The Evix smart contract exposes a minimal interface for on-chain swap execution.

## IEvix

```solidity
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
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenIn` | `address` | The ERC-20 token being sold |
| `tokenOut` | `address` | The ERC-20 token being bought |
| `amountIn` | `uint256` | Exact amount of `tokenIn` to swap (must be > 0) |
| `deadline` | `uint256` | Unix timestamp - transaction reverts if `block.timestamp > deadline` |
| `minAmountOut` | `uint256` | Minimum acceptable output - reverts if actual output is lower |
| `recipient` | `address` | Receives the output tokens (must not be `address(0)`) |

## Return Value

| Name | Type | Description |
|------|------|-------------|
| `amountOut` | `uint256` | The actual amount of `tokenOut` delivered to `recipient` |

## Events

### Swap

Emitted on every successful swap execution.

```solidity
event Swap(
    address indexed sender,
    address indexed tokenIn,
    address indexed tokenOut,
    uint256 amountIn,
    uint256 amountOut,
    address recipient
);
```

| Field | Indexed | Description |
|-------|---------|-------------|
| `sender` | Yes | `msg.sender` - the address that initiated the swap |
| `tokenIn` | Yes | Input token address |
| `tokenOut` | Yes | Output token address |
| `amountIn` | No | Input amount |
| `amountOut` | No | Actual output amount |
| `recipient` | No | Address that received the output tokens |

## Errors

| Error | Signature | When |
|-------|-----------|------|
| Deadline exceeded | `DeadlineExceeded()` | `block.timestamp > deadline` |
| Insufficient output | `InsufficientOutput(uint256 amountOut, uint256 minAmountOut)` | Actual output < `minAmountOut` |
| Invalid input | `InvalidAmountIn()` | `amountIn == 0` |
| Invalid recipient | `InvalidRecipient()` | `recipient == address(0)` |
| Unsupported pair | `UnsupportedPair(address tokenIn, address tokenOut)` | Pair not allowlisted |

## ABI

The full ABI is available in the TypeScript SDK as `evixAbi`:

```typescript
import { evixAbi } from "./sdk";
```

<details>
<summary>Raw ABI JSON</summary>

```json
[
  {
    "type": "function",
    "name": "swap",
    "inputs": [
      { "name": "tokenIn", "type": "address" },
      { "name": "tokenOut", "type": "address" },
      { "name": "amountIn", "type": "uint256" },
      { "name": "deadline", "type": "uint256" },
      { "name": "minAmountOut", "type": "uint256" },
      { "name": "recipient", "type": "address" }
    ],
    "outputs": [{ "name": "amountOut", "type": "uint256" }],
    "stateMutability": "payable"
  },
  {
    "type": "event",
    "name": "Swap",
    "inputs": [
      { "name": "sender", "type": "address", "indexed": true },
      { "name": "tokenIn", "type": "address", "indexed": true },
      { "name": "tokenOut", "type": "address", "indexed": true },
      { "name": "amountIn", "type": "uint256", "indexed": false },
      { "name": "amountOut", "type": "uint256", "indexed": false },
      { "name": "recipient", "type": "address", "indexed": false }
    ]
  },
  {
    "type": "error",
    "name": "DeadlineExceeded",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientOutput",
    "inputs": [
      { "name": "amountOut", "type": "uint256" },
      { "name": "minAmountOut", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAmountIn",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRecipient",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnsupportedPair",
    "inputs": [
      { "name": "tokenIn", "type": "address" },
      { "name": "tokenOut", "type": "address" }
    ]
  }
]
```

</details>

## Read Functions

### getSupportedPairs

```solidity
function getSupportedPairs() external view returns (address[] memory tokensA, address[] memory tokensB);
```

Returns all currently supported token pairs on the deployment. Useful for checking which pairs are available before attempting a swap.

:::info
Pair configuration is managed by Inductiv. To request new pairs, contact [Inductiv](https://inductiv.io).
:::
