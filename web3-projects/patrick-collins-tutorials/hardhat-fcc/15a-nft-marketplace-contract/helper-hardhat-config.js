const { ethers } = require("hardhat")

// https://vrf.chain.link/
const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "7395",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "10000000000000000", // 0.01 ETH
        ethUsdPriceFeedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "939",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "10000000000000000", // 0.01 ETH
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.3"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "10000000000000000", // 0.01 ETH
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 12

const frontEndContractsFile = "../nextjs-nft-marketplace-moralis-fcc/constants/networkMapping.json"
const frontEndContractsFile2 =
    "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis-fcc/constants/"
const frontEndAbiLocation2 = "../nextjs-nft-marketplace-thegraph-fcc/constants/"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndContractsFile2,
    frontEndAbiLocation,
    frontEndAbiLocation2,
}
