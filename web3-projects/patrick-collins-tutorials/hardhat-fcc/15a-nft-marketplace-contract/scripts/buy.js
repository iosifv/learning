const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 1

async function buyItem() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")

    console.log("Searching for listing with tokenId = " + TOKEN_ID)

    const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
    const price = listing.price.toString()
    const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: price })
    await tx.wait(1)
    console.log("NFT Bought!")

    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
