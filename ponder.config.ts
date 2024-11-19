import { createConfig } from "@ponder/core";
import { http } from "viem";

import { erc20 } from "./abis/erc20abi";
import { tokenAddresses } from "./src/utils";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    token: {
      network: "mainnet",
      abi: erc20,
      address: tokenAddresses,
      startBlock: 18722779,
      endBlock: 19000000,
    },
  },
});
