## Commands
- yarn add --dev hardhat
- hh
- yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
- yarn hardhat run scripts/aaveBorrow.js
- yarn add --dev @aave/protocol-v2

## Running this thing
- yarn hardhat run scripts/aaveBorrow.js
- hh run scripts/aaveBorrow.js
- 


## What we want to do
1. Deposit collateral || ETH / WETH
2. Borrow another asset: DAI
3. Repay the DAI
