import { ponder } from "@/generated";
import { Address } from "viem";
import { erc20 } from "../abis/erc20abi";
import { userTokens } from "../ponder.schema";
import { tokenAddresses } from "./utils";

type tokenInfo = {
  address: Address, 
  name: string, 
  symbol: string, 
  decimals: number
};

export const tokenInfoMap: Map<Address, tokenInfo> = new Map(); 

ponder.on("Token:Transfer", async ({event, context}) => {
  const {from, to, value} = event.args; 
  const tokenAddress = event.log.address; 

  await context.db.insert(userTokens).values({
    id: `${to}-${tokenAddress}`, 
    userAddress: to,
    tokenAddress,
    balance: value, 
  }).onConflictDoUpdate((row) => ({
    balance: row.balance + value
  })); 

  await context.db.insert(userTokens).values({
    id: `${from}-${tokenAddress}`,
    userAddress: from,
    tokenAddress,
    balance: value, 
  }).onConflictDoUpdate((row) => ({
    balance: row.balance + value
  }));

  console.log(`from: ${from}, to: ${to}, value: ${value}`); 
}); 

ponder.on("Token:setup", async ({context}) => {
  for (const address of tokenAddresses) {
    const name = await context.client.readContract({
      abi: erc20, 
      address, 
      functionName: "name"
    }); 

    const decimals = await context.client.readContract({
      abi: erc20, 
      address, 
      functionName: "decimals"
    }); 

    const symbol = await context.client.readContract({
      abi: erc20, 
      address, 
      functionName: "symbol"
    }); 

    console.log(`token: ${name} decimals: ${decimals} symbol: ${symbol}`); 

    tokenInfoMap.set(address, {
      address, 
      name, 
      symbol, 
      decimals
    }); 
  }
})