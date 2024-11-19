import type { Address } from "viem";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const tokenAddresses = [
  "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
  //"0xC003D79B8a489703b1753711E3ae9fFDFC8d1a82",
  //"0x34b3a8e2486D41E25d1c42cA63527437048CCdA3",
  //"0xec37d4De88D53a1ff7AC266f2F1F3F021BC4dBC7"
].map((t) => t.toLowerCase()) as Address[];

type tokenInfo = {
  address: Address;
  symbol: string;
  decimals: number;
};

export const tokenInfoMap: Map<Address, tokenInfo> = new Map();

tokenInfoMap.set(
  "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110".toLowerCase() as Address,
  {
    address:
      "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110".toLowerCase() as Address,
    symbol: "ezETH",
    decimals: 18,
  },
);
