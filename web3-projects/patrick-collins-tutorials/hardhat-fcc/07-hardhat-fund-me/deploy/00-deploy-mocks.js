const { network } = require("hardhat") // hre == Hardhat Runtime Environment
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

// const DECIMALS = "8"
// const INITIAL_PRICE = "200000000000" // 2000

//   ==> Syntactic sugar method
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        // if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        // The arguments of this contract are:
        //  - number of decimals
        //  - answer to what is the initial price
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("---------------------------------------")
    }
}

// yarn hardhat deploy --tags mocks
module.exports.tags = ["all", "mocks"]
