---
sidebar_position: 2
title: Installation
---

# Installation

Evix provides reference SDK implementations for TypeScript and Rust. These are starting points for your own integration - adapt them to your needs. You can also integrate directly at the Solidity level.

The SDK source code is available in the [GitHub repository](https://github.com/evix-trade/evix/tree/master/sdk).

## TypeScript SDK

The TypeScript SDK uses [viem](https://viem.sh) v2.21.0 or later. See the [source code](https://github.com/evix-trade/evix/tree/master/sdk/typescript).

### Key exports

```typescript
import {
  EvixClient,       // Main client class
  evixAbi,          // Contract ABI (for direct viem usage)
} from "./sdk";

import type {
  SwapParams,        // Swap input parameters
  SwapResult,        // Swap execution result
  EvixClientConfig,  // Client constructor config
} from "./sdk";
```

## Rust SDK

The Rust SDK uses [alloy](https://github.com/alloy-rs/alloy) 0.9. See the [source code](https://github.com/evix-trade/evix/tree/master/sdk/rust).

### Key exports

```rust
use evix_sdk::{
    EvixClient,   // Main client struct
    SwapParams,   // Swap input parameters
    SwapResult,   // Swap execution result
    EvixError,    // Error types
};
```

## Direct Solidity Integration

If you prefer to call the contract directly without an SDK, use the interface:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

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
```

Call it from your contract:

```solidity
import {IEvix} from "./interfaces/IEvix.sol";

contract MyProtocol {
    IEvix public immutable evix;

    constructor(address _evix) {
        evix = IEvix(_evix);
    }

    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(evix), amountIn);

        return evix.swap(
            tokenIn,
            tokenOut,
            amountIn,
            block.timestamp + 120,
            minAmountOut,
            msg.sender
        );
    }
}
```

## Requirements

| Component | Requirement |
|-----------|------------|
| TypeScript SDK | Node.js 18+, viem ^2.21.0 |
| Rust SDK | Rust 1.75+, alloy 0.9 |
| Solidity | Solc ^0.8.28 |
