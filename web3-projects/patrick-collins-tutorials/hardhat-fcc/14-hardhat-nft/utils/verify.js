const { run } = require("hardhat")

// async function verify(contractAddress: string, args: any[]) {

async function verify(contractAddress, args) {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        // } catch (error: any) {
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        }
        console.log(error)
    }
}

module.exports = { verify }
