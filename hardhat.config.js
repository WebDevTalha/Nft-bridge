require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    bscTestnet: {
      url: process.env.BSC_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    optimismGoerli: {
      url: process.env.OP_GOERLI_RPC_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_KEY,
      bscTestnet: process.env.BSCSCAN_KEY,
      optimisticGoerli: process.env.OP_SCAN_KEY,
      polygonMumbai: process.env.POLYGON_SCAN_KEY,
    },
  },
};
