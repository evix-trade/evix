export const evixAbi = [
  {
    type: "function",
    name: "swap",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "Swap",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "tokenIn", type: "address", indexed: true },
      { name: "tokenOut", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
      { name: "recipient", type: "address", indexed: false },
    ],
  },
  {
    type: "error",
    name: "DeadlineExceeded",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientOutput",
    inputs: [
      { name: "amountOut", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidAmountIn",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRecipient",
    inputs: [],
  },
  {
    type: "error",
    name: "UnsupportedPair",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
    ],
  },
] as const;
