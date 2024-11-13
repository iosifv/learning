// I am taking only the variable networkConfig from this whole file
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat") // hre == Hardhat Runtime Environment
const { verify } = require("../utils/verify")

//   ==> Standard method
// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
// }

//   ==> Syntactic sugar method
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    // use a mock when using localhost or tests
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("---------------------------------------")
}

module.exports.tags = ["all", "fundme"]

// if I run "yarn hardhat node"
// => spins up the local node and it automatically deploys these deployment scripts
