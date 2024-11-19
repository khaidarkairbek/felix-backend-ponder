import { ponder } from "@/generated";
import { and, eq, graphql, gt, gte, lte } from "@ponder/core";
import type { Address } from "viem";
import { userTokens, userTokensTimestamp } from "../../ponder.schema";
import { tokenAddresses, tokenInfoMap } from "../utils";

const ONE_HOUR = BigInt(60 * 60);
const ONE_DAY = ONE_HOUR * BigInt(24);
const ONE_MONTH = ONE_DAY * BigInt(30);

ponder.use("/graphql", graphql());
ponder.use("/", graphql());

ponder.get("/live/:address", async (c) => {
  const address = c.req.param("address");

  const balances = await c.db
    .select()
    .from(userTokens)
    .where(eq(userTokens.userAddress, address))
    .execute();

  return c.json({
    address: address,
    balances: balances.map((b) => ({
      token: b.tokenAddress,
      amount: balanceToNumber(b.balance, b.tokenAddress, 3),
    })),
  });
});

/**
 * Converts a bigint balance into a formatted number based on token decimals.
 */
function balanceToNumber(
  value: bigint,
  tokenAddress: string,
  decimals: number,
) {
  return (
    Number(
      value /
        BigInt(10) **
          BigInt(
            tokenInfoMap.get(tokenAddress as Address)!.decimals - decimals,
          ),
    ) /
    10 ** decimals
  );
}

type HistoricalBalanceRecord = {
  token: Address;
  record: {
    timestamp: number;
    balance: number;
  }[];
};

function generateRequiredTimestamps(
  currentTimestamp: bigint,
  oneHour: bigint,
  oneDay: bigint,
): bigint[] {
  const timestamps: bigint[] = [];

  for (let i = 0n; i < 24n; i++) {
    timestamps.push(currentTimestamp - i * oneHour);
  }

  for (let i = 1n; i < 180n; i++) {
    timestamps.push(currentTimestamp - i * oneDay);
  }

  return timestamps.sort((a, b) => (a > b ? 1 : -1)); //ascending order
}

ponder.get("/historical/:address/:timestamp", async (c) => {
  const address = c.req.param("address");
  const timestamp = Number(c.req.param("timestamp"));
  const beginTimestamp = Date.now();
  const currentTimestamp = (BigInt(timestamp) / ONE_HOUR) * ONE_HOUR;

  const requiredTimestamps = generateRequiredTimestamps(
    currentTimestamp,
    ONE_HOUR,
    ONE_DAY,
  );

  const balanceRecords = await c.db
    .select()
    .from(userTokensTimestamp)
    .where(
      and(
        eq(userTokensTimestamp.userAddress, address),
        lte(userTokensTimestamp.timestamp, requiredTimestamps.at(-1)!),
      ),
    )
    .execute();

  const historicalBalances: HistoricalBalanceRecord[] = [];

  for (const tokenAddress of tokenAddresses) {
    const tokenBalanceRecords = balanceRecords
      .filter((b) => b.tokenAddress === tokenAddress)
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)); //ascending order

    const returnRecord: HistoricalBalanceRecord = {
      token: tokenAddress,
      record: [],
    };

    let lastIndex = 0;

    for (const timestamp of requiredTimestamps) {
      while (
        lastIndex < tokenBalanceRecords.length &&
        tokenBalanceRecords[lastIndex]!.timestamp <= timestamp
      ) {
        lastIndex++;
      }
      const latestRecord = tokenBalanceRecords[lastIndex - 1];

      returnRecord.record.push({
        timestamp: Number(timestamp),
        balance:
          latestRecord !== undefined
            ? balanceToNumber(latestRecord.balance, tokenAddress, 3)
            : 0,
      });
    }

    historicalBalances.push(returnRecord);
  }

  console.log(`API processing time: ${Date.now() - beginTimestamp}`);

  return c.json(historicalBalances);
});
