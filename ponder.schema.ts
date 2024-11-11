import { onchainTable, primaryKey, relations } from "@ponder/core";

export const userTokens = onchainTable("userTokens", 
  (t) => ({
    tokenAddress: t.text().notNull(),
    userAddress: t.text().notNull(),
    balance: t.bigint().notNull()
  }), 
  (table) => ({ id: primaryKey({columns: [table.userAddress, table.tokenAddress]})})
); 