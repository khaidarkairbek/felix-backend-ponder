import { onchainTable, primaryKey, relations } from "@ponder/core";

export const userTokensTimestamp = onchainTable(
  "userTokensTimestamp",
  (t) => ({
    tokenAddress: t.text().notNull(),
    userAddress: t.text().notNull(),
    balance: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    id: primaryKey({
      columns: [table.userAddress, table.tokenAddress, table.timestamp],
    }),
  }),
);

export const userTokens = onchainTable(
  "userTokens",
  (t) => ({
    tokenAddress: t.text().notNull(),
    userAddress: t.text().notNull(),
    balance: t.bigint().notNull(),
  }),
  (table) => ({
    id: primaryKey({ columns: [table.userAddress, table.tokenAddress] }),
  }),
);
