import { Address } from "viem";

export const tokenAddresses = [
  "0xC003D79B8a489703b1753711E3ae9fFDFC8d1a82", 
  "0x34b3a8e2486D41E25d1c42cA63527437048CCdA3", 
  "0xec37d4De88D53a1ff7AC266f2F1F3F021BC4dBC7"
].map((t) => t.toLowerCase()) as Address[]; 