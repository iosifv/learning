# Notes
- yarn hardhat test
- yarn hardhat coverage
- yarn hardhat deploy --tags mocks
- yarn hardhat deploy
- yarn hardhat deploy --network rinkeby
- yarn hardhat test --network rinkeby
  - Get back your lost ETH :P
  - yarn hardhat run scripts/withdraw.js --network rinkeby
- 
- yarn hardhat node
- yarn hardhat run scripts/fund.js --network localhost
- yarn hardhat run scripts/withdraw.js --network localhost



# Deployments

- https://rinkeby.etherscan.io/address/0x278D7c942B4F0347CE15B29f3D3340530218f576
Error: ERROR processing /Users/iosif/www/github/web3-tutorials/patrick-collins-tutorials/hardhat-fcc/hardhat-fund-me/deploy/01-deploy-fund-me.js:
TypeError: verify is not a function
    at Object.module.exports [as func] (/Users/iosif/www/github/web3-tutorials/patrick-collins-tutorials/hardhat-fcc/hardhat-fund-me/deploy/01-deploy-fund-me.js:39:15)


- https://rinkeby.etherscan.io/address/0x278D7c942B4F0347CE15B29f3D3340530218f576#code

- https://rinkeby.etherscan.io/address/0x9b62380018030fe48149906b20f21a05ad4ab1ad - failed test withdraw 


·--------------------------------|----------------------------|-------------|-----------------------------·
|      Solc version: 0.8.8       ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·································|····························|·············|······························
|  Methods                       ·               26 gwei/gas                ·       1237.87 usd/eth       │
·············|···················|·············|··············|·············|···············|··············
|  Contract  ·  Method           ·  Min        ·  Max         ·  Avg        ·  # calls      ·  usd (avg)  │
·············|···················|·············|··············|·············|···············|··············
|  FundMe    ·  cheaperWithdraw  ·      35744  ·       77744  ·      56744  ·            4  ·       1.83  │
·············|···················|·············|··············|·············|···············|··············
|  FundMe    ·  fund             ·      87159  ·      104259  ·      94200  ·           17  ·       3.03  │
·············|···················|·············|··············|·············|···············|··············
|  FundMe    ·  withdraw         ·      35640  ·       78348  ·      56994  ·            4  ·       1.83  │
·············|···················|·············|··············|·············|···············|··············
|  Deployments                   ·                                          ·  % of limit   ·             │
·································|·············|··············|·············|···············|··············
|  FundMe                        ·          -  ·           -  ·    1035118  ·        3.5 %  ·      33.31  │
·································|·············|··············|·············|···············|··············
|  MockV3Aggregator              ·          -  ·           -  ·     569635  ·        1.9 %  ·      18.33  │
·--------------------------------|-------------|--------------|-------------|---------------|-------------·