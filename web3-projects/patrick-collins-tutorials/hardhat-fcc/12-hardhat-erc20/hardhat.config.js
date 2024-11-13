require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // solidity: "0.8.8",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    // ropsten: {
    //     url: process.env.ROPSTEN_URL || "",
    //     accounts:
    //         process.env.PRIVATE_KEY !== undefined
    //             ? [process.env.PRIVATE_KEY]
    //             : [],
    // },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },
    hardhat: {
      accounts: {
        count: 3,
        accountsBalance: "10000000000000000000", // 10 ETH
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    // outputFile: "gas-report.txt",
    // noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "ETH",
  },
};
