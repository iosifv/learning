const { ethers } = require("hardhat")

async function main() {
    // Upgrade! Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy") // hh automatically renames these

    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address)
    const versionV1 = await proxyBoxV1.version()
    console.log("Version: " + versionV1.toString())

    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const versionV2 = await proxyBoxV2.version()
    console.log("Version: " + versionV2.toString())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// run like this:
// hh node
// hh run scripts/upgrade-box.js --network localhost
