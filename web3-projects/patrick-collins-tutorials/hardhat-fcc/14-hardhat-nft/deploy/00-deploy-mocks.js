const { network } = require("hardhat") // hre == Hardhat Runtime Environment
const { developmentChains } = require("../helper-hardhat-config")
const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether")

// This is how much LINK it costs to run the VRF
const BASE_FEE = ethers.utils.parseEther("0.25")
// Link per gas
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // Deploy a mock VRF coordinator:
        //  - number of decimals
        //  - answer to what is the initial price
        await deploy("VRFCoordinatorV2Mock", {
            contract: "",
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks deployed!")
        log("---------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
