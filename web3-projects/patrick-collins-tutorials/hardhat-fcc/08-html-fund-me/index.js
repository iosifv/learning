// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js"
import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    console.log("Connecting...")
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        connectButton.innerHTML = "Connected"

        // Extra from me:
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = provider.getSigner()
        // console.log(signer.provider.provider)
    } else {
        fundButton.innerHTML = "Please Install Metamask"
    }
}

async function withdraw() {
    console.log("Withdrawing...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    console.log("Getting balance...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    } else {
        console.log("Please Install Metamask")
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log("Funding with... " + ethAmount)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)

        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log("Mining " + transactionResponse.hash)

    return new Promise((resolve, reject) => {
        // create a listener for the blockchain
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                "Completed with " +
                    transactionReceipt.confirmations +
                    " confirmations"
            )
            // only resolve this once we are done waiting for provider.once
            resolve()
        })
    })
}
