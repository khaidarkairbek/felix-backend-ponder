import { ponder } from "@/generated";
import { userTokens, userTokensTimestamp } from "../ponder.schema";
import { NULL_ADDRESS } from "./utils";

ponder.on("token:Transfer", async ({ event, context }) => {
  const from = event.args.from.toLowerCase();
  const to = event.args.to.toLowerCase();
  const value = event.args.value;
  const tokenAddress = event.log.address.toLowerCase();

  if (to !== tokenAddress && to !== NULL_ADDRESS) {
    const liveToData = await context.db
      .insert(userTokens)
      .values({
        userAddress: to,
        tokenAddress,
        balance: value,
      })
      .onConflictDoUpdate((row) => ({
        balance: row.balance + value,
      }));

    await context.db
      .insert(userTokensTimestamp)
      .values({
        userAddress: to,
        tokenAddress,
        balance: liveToData.balance,
        timestamp: event.block.timestamp,
      })
      .onConflictDoUpdate({
        balance: liveToData.balance,
      });
  }
  
  if (from !== tokenAddress && from !== NULL_ADDRESS) {
    const liveFromData = await context.db
      .update(userTokens, {
        tokenAddress,
        userAddress: from,
      })
      .set((row) => ({
        balance: row.balance - value,
      }));

    await context.db
      .insert(userTokensTimestamp)
      .values({
        userAddress: from,
        tokenAddress,
        balance: liveFromData.balance,
        timestamp: event.block.timestamp,
      })
      .onConflictDoUpdate({
        balance: liveFromData.balance,
      });
  }
});
