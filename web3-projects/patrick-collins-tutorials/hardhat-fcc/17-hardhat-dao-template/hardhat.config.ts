import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import {HardhatUserConfig} from "hardhat/config";

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.8",
// };

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    // it uses hh network when you run tests
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    // it uses localhost network when you run node
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
}

export default config