import type { PublicClient, WalletClient } from "viem";

export type SwapParams = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  deadline: bigint;
  minAmountOut: bigint;
  recipient: `0x${string}`;
};

export type SwapResult = {
  amountOut: bigint;
  transactionHash: `0x${string}`;
};

export type EvixClientConfig = {
  chainId: number;
  contractAddress: `0x${string}`;
  publicClient: PublicClient;
  walletClient?: WalletClient;
};
