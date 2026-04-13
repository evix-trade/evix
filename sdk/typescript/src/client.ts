import type { PublicClient, WalletClient } from "viem";
import { evixAbi } from "./abi.js";
import type { EvixClientConfig, SwapParams, SwapResult } from "./types.js";

export class EvixClient {
  readonly chainId: number;
  readonly contractAddress: `0x${string}`;
  private readonly publicClient: PublicClient;
  private readonly walletClient: WalletClient | undefined;

  constructor(config: EvixClientConfig) {
    this.chainId = config.chainId;
    this.contractAddress = config.contractAddress;
    this.publicClient = config.publicClient;
    this.walletClient = config.walletClient;
  }

  async swap(params: SwapParams): Promise<SwapResult> {
    if (!this.walletClient) {
      throw new Error("WalletClient required for swap execution");
    }

    const { request, result } = await this.publicClient.simulateContract({
      address: this.contractAddress,
      abi: evixAbi,
      functionName: "swap",
      args: [
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.deadline,
        params.minAmountOut,
        params.recipient,
      ],
      account: this.walletClient.account,
    });

    const hash = await this.walletClient.writeContract(request);

    return {
      amountOut: result,
      transactionHash: hash,
    };
  }

  async populateSwap(params: SwapParams) {
    const { request } = await this.publicClient.simulateContract({
      address: this.contractAddress,
      abi: evixAbi,
      functionName: "swap",
      args: [
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.deadline,
        params.minAmountOut,
        params.recipient,
      ],
      account: this.walletClient?.account,
    });

    return request;
  }

  async simulateSwap(params: SwapParams): Promise<bigint> {
    const { result } = await this.publicClient.simulateContract({
      address: this.contractAddress,
      abi: evixAbi,
      functionName: "swap",
      args: [
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.deadline,
        params.minAmountOut,
        params.recipient,
      ],
      account: this.walletClient?.account,
    });

    return result;
  }
}
