import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatNetworkAccountsUserConfig } from "hardhat/types";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const accounts: HardhatNetworkAccountsUserConfig = [
  process.env.PRIVATE_ADDRESS,
];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts,
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts,
    },
    eth_mainnet: {
      url: "https://mainnet.infura.io/v3/",
      chainId: 1,
      gasPrice: 20000000000,
      accounts,
    },
  },
};

export default config;
