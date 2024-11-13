const { ethers } = require("hardhat")

// https://vrf.chain.link/
const networkConfig = {
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

module.exports = {
    networkConfig,
    developmentChains,
}

// const networkConfig = {
//     31337: {
//         name: "localhost",
//         ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
//         gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
//         mintFee: "10000000000000000", // 0.01 ETH
//         callbackGasLimit: "500000", // 500,000 gas
//     },
//     // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
//     // Default one is ETH/USD contract on Kovan
//     4: {
//         name: "rinkeby",
//         ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
//         vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
//         gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
//         callbackGasLimit: "500000", // 500,000 gas
//         mintFee: "10000000000000000", // 0.01 ETH
//         subscriptionId: "1002", // add your ID here!
//     },
// }

// const DECIMALS = "18"
// const INITIAL_PRICE = "200000000000000000000"
// const developmentChains = ["hardhat", "localhost"]

// module.exports = {
//     networkConfig,
//     developmentChains,
//     DECIMALS,
//     INITIAL_PRICE,
// }
