import { describe, it, expect } from "vitest";
import { EvixClient } from "../src/client.js";

describe("EvixClient", () => {
  it("should initialize with config", () => {
    const client = new EvixClient({
      chainId: 8453,
      contractAddress: "0x1234567890123456789012345678901234567890",
      publicClient: {} as any,
    });

    expect(client.chainId).toBe(8453);
    expect(client.contractAddress).toBe(
      "0x1234567890123456789012345678901234567890"
    );
  });

  it("should throw on swap without walletClient", async () => {
    const client = new EvixClient({
      chainId: 8453,
      contractAddress: "0x1234567890123456789012345678901234567890",
      publicClient: {} as any,
    });

    await expect(
      client.swap({
        tokenIn: "0x1111111111111111111111111111111111111111",
        tokenOut: "0x2222222222222222222222222222222222222222",
        amountIn: 1000n,
        deadline: 9999999999n,
        minAmountOut: 900n,
        recipient: "0x3333333333333333333333333333333333333333",
      })
    ).rejects.toThrow("WalletClient required for swap execution");
  });
});
