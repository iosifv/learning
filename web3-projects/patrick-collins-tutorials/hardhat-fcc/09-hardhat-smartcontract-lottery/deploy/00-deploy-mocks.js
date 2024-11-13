const { network } = require("hardhat") // hre == Hardhat Runtime Environment
const { developmentChains } = require("../helper-hardhat-config")

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
        log("Mocks deployed!")
        log("---------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
