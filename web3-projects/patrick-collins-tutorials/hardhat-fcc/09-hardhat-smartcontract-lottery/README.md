# Notes
- https://docs.chain.link/docs/get-a-random-number/
- 


# CLI commands
- yarn add --dev hardhat
- yarn hardhat 
- yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
- yarn hardhat compile
- yarn add --dev @chainlink/contracts
- yarn global add hardhat-shorthand
- hh compile
- hh test
- hh test --grep "something from the it() string"


# Chainlink Subscription
- (Chainlink VRF)[https://vrf.chain.link/]
- login with Metamask, select Rinkeby and click on "Create Subscription"
- (Subscription creation Tx)[https://rinkeby.etherscan.io/tx/0x98cd839194a2a786577c6cdcb78988a552106a67c24d3f539077d824fd03fab4]
- My subscription id: 7395
- (Add Funds - 5 LINK)[https://rinkeby.etherscan.io/tx/0x44e8137c9ba1c12c376a8a1b678def82417659d05b337fd6cb17f86ea9b9f111]


# Deploy to Rinkeby
- hh deploy --network rinkeby
```
Nothing to compile
deploying "Raffle" (tx: 0x668178e95b0701e4ea39f64c1f6362baf45140e508751bdd9e38ec611edafff2)...: 
deployed at 0xC34f548dFA32cce246C9dd911FbbC5Bd0B984C68 with 1226350 gas
An unexpected error occurred:

Error: ERROR processing [...]/hardhat-fcc/smartcontract-lottery/deploy/01-deploy-raffle.js:
ReferenceError: raffle is not defined
    at Object.module.exports [as func] ([...]/hardhat-fcc/smartcontract-lottery/deploy/01-deploy-raffle.js:50:22)
```

- A few moments later
```
[]...]
Successfully submitted source code for contract
contracts/Raffle.sol:Raffle at 0xC34f548dFA32cce246C9dd911FbbC5Bd0B984C68
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Raffle on Etherscan.
https://rinkeby.etherscan.io/address/0xC34f548dFA32cce246C9dd911FbbC5Bd0B984C68#code
```


# Register the new contract with Chainlink
- hh test --network rinkeby  
```

```

# Test everything
- [Tutorial Video exact timestamp](https://youtu.be/gyMwXuJrbJQ?t=59253)
- [Chainlink VRF Website](https://vrf.chain.link/rinkeby/7395)
```
Raffle Staging Tests
    fulfillRandomWords
Verifying contract ...
Nothing to compile
Warning: Unnamed return variable can remain unassigned. Add an explicit return with value to all non-reverting code paths or name the variable.
  --> contracts/Raffle.sol:97:13:
   |
97 |             bytes memory /* performData */
   |             ^^^^^^^^^^^^


Warning: Function state mutability can be restricted to view
  --> contracts/Raffle.sol:90:5:
   |
90 |     function checkUpkeep(
   |     ^ (Relevant source part starts here and spans across multiple lines).


Successfully submitted source code for contract
contracts/Raffle.sol:Raffle at 0xDee92dAF3C4f87C72cf14b77E81A5c8d3706fdC7
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Raffle on Etherscan.
https://rinkeby.etherscan.io/address/0xDee92dAF3C4f87C72cf14b77E81A5c8d3706fdC7#code

      1) "before each" hook for "works with live Chainlink Keepers and Chainlink VRF, we get a random winner"

·-----------------------|----------------------------|-------------|----------------------------·
|  Solc version: 0.8.8  ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
························|····························|·············|·····························
|  Methods              ·               110 gwei/gas               ·      1221.47 usd/eth       │
·············|··········|··············|·············|·············|·············|···············
|  Contract  ·  Method  ·  Min         ·  Max        ·  Avg        ·  # calls    ·  usd (avg)   │
·------------|----------|--------------|-------------|-------------|-------------|--------------·

  0 passing (2m)
  1 failing

  1) Raffle Staging Tests
       "before each" hook for "works with live Chainlink Keepers and Chainlink VRF, we get a random winner":
     ProviderError: Unsupported method: evm_snapshot. See available methods at https://docs.alchemy.com/alchemy/documentation/apis
      at HttpProvider.request (node_modules/hardhat/src/internal/core/providers/http.ts:78:19)
      at LocalAccountsProvider.request (node_modules/hardhat/src/internal/core/providers/accounts.ts:188:34)
      at processTicksAndRejections (internal/process/task_queues.js:95:5)
      at DeploymentsManager.saveSnapshot (node_modules/hardhat-deploy/src/DeploymentsManager.ts:1418:22)
      at Object.fixture (node_modules/hardhat-deploy/src/DeploymentsManager.ts:323:9)
      at Context.<anonymous> (test/staging/Raffle.staging.test.js:14:15)

```


# Test everything again
- 
```
$> hh test --network rinkeby

Raffle Staging Tests
    fulfillRandomWords
Setting up test...
Setting up Listener...
Entering Raffle...
Event: WinnerPicked was found!
ReferenceError: Cannot access 'winnerStartingBalance' before initialization
    at FragmentRunningEvent.<anonymous> (/Users/iosif/www/github/web3-tutorials/patrick-collins-tutorials/hardhat-fcc/smartcontract-lottery/test/staging/Raffle.staging.test.js:44:35)
```

- I had to move `const winnerStartingBalance = await accounts[0].getBalance()` before the promise
```
  Raffle Staging Tests
    fulfillRandomWords
Setting up test...
Setting up Listener...
Entering Raffle...
Event: WinnerPicked was found!
      ✓ works with live Chainlink Keepers and Chainlink VRF, we get a random winner (11807592 gas)

·-----------------------|----------------------------|-------------|----------------------------·
|  Solc version: 0.8.8  ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
························|····························|·············|·····························
|  Methods              ·               85 gwei/gas                ·      1228.84 usd/eth       │
·············|··········|··············|·············|·············|·············|···············
|  Contract  ·  Method  ·  Min         ·  Max        ·  Avg        ·  # calls    ·  usd (avg)   │
·------------|----------|--------------|-------------|-------------|-------------|--------------·

  1 passing (3m)
  ```