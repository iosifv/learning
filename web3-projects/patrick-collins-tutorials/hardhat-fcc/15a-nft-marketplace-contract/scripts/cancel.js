const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 0

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")

    console.log("Searching for listing with tokenId = " + TOKEN_ID)
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
    await tx.wait(1)
    console.log("NFT Cancelled!")

    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
