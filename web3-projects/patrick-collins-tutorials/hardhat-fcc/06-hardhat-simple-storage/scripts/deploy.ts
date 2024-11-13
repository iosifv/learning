// imports
// const { ethers, run, network } = require("hardhat")
import { ethers, run, network } from "hardhat"

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract ...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log("Deployed contract to " + simpleStorage.address)

    // Check if the network we are running is a live network?
    // console.log(network.config)
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("wait for block txes...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    // Get the current value
    const currentValue = await simpleStorage.retrieve()
    console.log("Current Value is: " + currentValue)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log("Updated Value is: " + updatedValue)
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        }
        console.log(error)
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
