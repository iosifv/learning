-   Link to part 3: https://youtu.be/gyMwXuJrbJQ?t=100647
-   `yarn add @apollo/client`
-   `yarn add graphql`
-   Stuck at... https://youtu.be/gyMwXuJrbJQ?t=103625

## Nothing to compile

```
hh deploy --network rinkeby
Warning: Function state mutability can be restricted to pure
  --> contracts/test/BasicNft.sol:23:5:
   |
23 |     function tokenURI(
   |     ^ (Relevant source part starts here and spans across multiple lines).


Compiled 12 Solidity files successfully
Starting deploy with wait block confirmations = 6
----------------------------------------------------
deploying "NftMarketplace" (tx: 0x04b50e1fd350dd52df6a476f07626b6b0e709272ba9f5c7ca965c3b53eec4574)...: deployed at 0xA82580DA24acB4858436D80DBaa08DC46028d8c8 with 1356627 gas
Verifying...
Verifying contract ...
Nothing to compile
Successfully submitted source code for contract
contracts/NftMarketplace.sol:NftMarketplace at 0xA82580DA24acB4858436D80DBaa08DC46028d8c8
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NftMarketplace on Etherscan.
https://rinkeby.etherscan.io/address/0xA82580DA24acB4858436D80DBaa08DC46028d8c8#code
----------------------------------------------------
Starting deploy with wait block confirmations = 6
----------------------------------------------------
deploying "BasicNft" (tx: 0xd746f2928f057e956a62cae45ef759d5a035ddc95c5d0269841c272a9c260ee0)...: deployed at 0xcbe022898bBB1AcBBF158192fB4Cc674CDdc296A with 2020849 gas
Verifying...
Verifying contract ...
Warning: Function state mutability can be restricted to pure
  --> contracts/test/BasicNft.sol:23:5:
   |
23 |     function tokenURI(
   |     ^ (Relevant source part starts here and spans across multiple lines).


Compiled 12 Solidity files successfully
Warning: Function state mutability can be restricted to pure
  --> contracts/test/BasicNft.sol:23:5:
   |
23 |     function tokenURI(
   |     ^ (Relevant source part starts here and spans across multiple lines).


Successfully submitted source code for contract
contracts/test/BasicNft.sol:BasicNft at 0xcbe022898bBB1AcBBF158192fB4Cc674CDdc296A
for verification on the block explorer. Waiting for verification result...

Successfully verified contract BasicNft on Etherscan.
https://rinkeby.etherscan.io/address/0xcbe022898bBB1AcBBF158192fB4Cc674CDdc296A#code
----------------------------------------------------
Updating frontend...
{
  '4': {
    NftMarketplace: [
      '0x8eE15b320AB73a1fEc788CaFbFc32db15E894365',
      '0xA82580DA24acB4858436D80DBaa08DC46028d8c8'
    ]
  },
  '5': {
    NftMarketplace: [
      '0xa5CdB6897F6bcfEcB00Fc47C9f7a649D5BeF85E5',
      '0xDee92dAF3C4f87C72cf14b77E81A5c8d3706fdC7'
    ]
  },
  '31337': { NftMarketplace: [ '0x5FbDB2315678afecb367f032d93F642f64180aa3' ] }
}
```

---

TheGraph Error

ERROR - 2022-09-08 06:34:09 p.m.
Subgraph failed with non-deterministic error: failed to process trigger: block #7554504 (0x52e7…aef0), transaction 9869e001a5d536553742231bf4079d2012e4b496f505dbae0ec7f0f9a3fedde3: Entity ActiveItem[0x00x704dcfe4763080ac7014ba15e16a3494edfbe677]: missing value for non-nullable field `buyer` wasm backtrace: 0: 0x2d9b - <unknown>!generated/schema/ActiveItem#save 1: 0x36fa - <unknown>!src/nft-marketplace/handleItemListed , retry_delay_s: 240, attempt: 1

INFO - 2022-09-08 06:34:09 p.m.
Done processing trigger, gas_used: 0, data_source: NftMarketplace, handler: handleItemListed, total_ms: 1097, transaction: 0x9869…dde3, address: 0xdee9…fdc7, signature: ItemListed(indexed address,indexed address,indexed uint256,uint256)

DEBUG - 2022-09-08 06:34:08 p.m.
1 candidate trigger in this block, block_hash: 0x52e78333a7f180e22db83db439657b62852584b183c1e8ff366a01a59fefaef0, block_number: 7554504
