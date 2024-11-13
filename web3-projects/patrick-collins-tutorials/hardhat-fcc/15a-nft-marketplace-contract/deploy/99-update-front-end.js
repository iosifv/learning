const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontendContractsFile = "../15b-nft-marketplace-nextjs-moralis/constants/networkMapping.json"
const frontendAbiLocationMoralis = "../15b-nft-marketplace-nextjs-moralis/constants/"
const frontendAbiLocationTheGraph = "../15c-nft-marketplace-nextjs-thegraph/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        frontendAbiLocationMoralis + "NftMarketplace.json",
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    fs.writeFileSync(
        frontendAbiLocationTheGraph + "NftMarketplace.json",
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        frontendAbiLocationMoralis + "BasicNft.json",
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
    fs.writeFileSync(
        frontendAbiLocationTheGraph + "BasicNft.json",
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const chainId = network.config.chainId.toString()
    const contractAddress = JSON.parse(fs.readFileSync(frontendContractsFile, "utf8"))
    if (chainId in contractAddress) {
        if (!contractAddress[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddress[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddress[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    console.log(contractAddress)
    fs.writeFileSync(frontendContractsFile, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
