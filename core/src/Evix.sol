// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IEvix} from "./interfaces/IEvix.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract Evix is IEvix {
    error DeadlineExceeded();
    error InsufficientOutput(uint256 amountOut, uint256 minAmountOut);
    error InvalidAmountIn();
    error InvalidRecipient();
    error UnsupportedPair(address tokenIn, address tokenOut);

    event Swap(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address recipient
    );

    address public immutable owner;

    mapping(bytes32 => bool) public supportedPairs;

    modifier onlyOwner() {
        require(msg.sender == owner, "Evix: unauthorized");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    /// @inheritdoc IEvix
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline,
        uint256 minAmountOut,
        address recipient
    ) external payable returns (uint256 amountOut) {
        if (block.timestamp > deadline) revert DeadlineExceeded();
        if (amountIn == 0) revert InvalidAmountIn();
        if (recipient == address(0)) revert InvalidRecipient();

        bytes32 pairKey = _pairKey(tokenIn, tokenOut);
        if (!supportedPairs[pairKey]) revert UnsupportedPair(tokenIn, tokenOut);

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        amountOut = _execute(tokenIn, tokenOut, amountIn);

        if (amountOut < minAmountOut) revert InsufficientOutput(amountOut, minAmountOut);

        IERC20(tokenOut).transfer(recipient, amountOut);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, recipient);
    }

    function setPairSupport(address tokenA, address tokenB, bool supported) external onlyOwner {
        bytes32 pairKey = _pairKey(tokenA, tokenB);
        supportedPairs[pairKey] = supported;
    }

    function _execute(address tokenIn, address tokenOut, uint256 amountIn)
        internal
        virtual
        returns (uint256 amountOut)
    {
        // Placeholder: deployment-specific execution logic
        // Each customer deployment overrides this with their configured strategy
        (tokenIn, tokenOut);
        amountOut = amountIn;
    }

    function _pairKey(address tokenA, address tokenB) internal pure returns (bytes32) {
        (address t0, address t1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encodePacked(t0, t1));
    }
}
