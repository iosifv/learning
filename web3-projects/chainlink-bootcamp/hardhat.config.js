require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "goerli",
  networks: {
    goerli:{
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    }
  }
};