const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 97,
        },
    ],
}

let tokenUris = [
    "ipfs://QmU8Pt7PiqPhrrpAdTNNcPVBgM1fgZt1j51YREgYA5rtcy",
    "ipfs://QmaPBk6yGe3sWfHSgqKvX6FGnzmv8wABP9zYR5YdBE5ybo",
    "ipfs://QmRVTno14ZcYCTv1WRc7cMWnBBzfu55s1SzpMKjWDskY8L",
]

const FUND_AMOUNT = "1000000000000000000000"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    /**
     * get the IPFS hashes of our images
     * 1. upload to your own IPFS node https://docs.ipfs.io/
     * 2. Pinata https://www.pinata.cloud/
     * 3. NFT.storage https://nft.storage/
     */
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReciept = await tx.wait(1)
        subscriptionId = txReciept.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    // await storeImages(imagesLocation)

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["mintFee"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenUris,
    ]

    // log("--- Deploying")
    // log(args)

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, args)
    }
    log("---------------------")
}

async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)

    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = "An adorable " + tokenUriMetadata.name + " pup!"
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        console.log(tokenUriMetadata)

        // Store the Json
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token Uris uploaded:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]

// hh deploy --tags randomipfs,mocks
