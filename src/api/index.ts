import { ponder } from "@/generated";
import { and, eq, graphql, gt } from "@ponder/core";
import { userTokens } from "../../ponder.schema";
import { tokenInfoMap } from "..";
import { Address } from "viem";

ponder.use("/graphql", graphql());
ponder.use("/", graphql());

ponder.get("/live/:address", async (c) => {
  const address = c.req.param("address");

  const balances = await c.db.select().from(userTokens).where(eq(userTokens.userAddress, address)).execute();
  
  return c.json({
    address: address, 
    balances: balances.map((b) => ({
      token: b.tokenAddress, 
      amount: Number(b.balance / BigInt(10) ** BigInt(tokenInfoMap.get(b.tokenAddress.toLowerCase() as Address)!.decimals - 3)) / 1000
    }))
  })
})