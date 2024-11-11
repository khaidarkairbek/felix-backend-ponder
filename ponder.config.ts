import { createConfig } from "@ponder/core";
import { http } from "viem";

import { erc20 } from "./abis/erc20abi";
import { tokenAddresses } from "./src/utils";

export default createConfig({
  networks: {
    hl: {
      chainId: 998,
      transport: http(process.env.PONDER_RPC_URL_998),
    },
  },
  contracts: {
    Token: {
      network: "hl",
      abi: erc20,
      address: tokenAddresses,
      startBlock: 10531953
    },
  },
});
