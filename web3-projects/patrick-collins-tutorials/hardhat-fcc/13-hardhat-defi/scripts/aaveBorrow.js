const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getWeth")

/**
 * General documentation
 * https://docs.aave.com/developers/v/2.0/
 *
 * Specific contract we need (to get the address of the lendingpool contract :P)
 * https://docs.aave.com/developers/v/2.0/the-core-protocol/addresses-provider/ilendingpooladdressesprovider
 *
 * Addresses for deployed contracts
 * https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
 *
 * => 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
 */
async function main() {
    /**
     * Setup
     */
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address: ${lendingPool.address}`)
    console.log(
        `Etherscan link:      https://etherscan.io/address/${lendingPool.address}`
    )

    /**
     * Deposit
     */
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    // Apprpove
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    /**
     * Borrow
     */
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer
    )
    const daiPrice = await getDAIPrice()
    // we just want to borrow up to 95%
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log("You can borrow DAI = " + amountDaiToBorrow)
    const amountDaiToBorrowWei = ethers.utils.parseEther(
        amountDaiToBorrow.toString()
    )

    // Borrow Time!
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(
        daiTokenAddress,
        lendingPool,
        amountDaiToBorrowWei,
        deployer
    )
    // Run again just to see if it's changed
    await getBorrowUserData(lendingPool, deployer)

    // Repay
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    // Run again just to see if it's changed
    await getBorrowUserData(lendingPool, deployer)
    // We'll be left with a small debt that is not repaid => representing the interest that we accrued
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    console.log("Repaid")
}

async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrowWei,
    account
) {
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrowWei,
        1,
        0,
        account
    )
    await borrowTx.wait(1)
    console.log("You have borrowed!")
}

async function getDAIPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log("The DAI/ETH price is " + price)
    return price
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)

    console.log("| =========")
    console.log("| totalCollateralETH:  " + totalCollateralETH)
    console.log("| totalDebtETH:        " + totalDebtETH)
    console.log("| availableBorrowsETH: " + availableBorrowsETH)
    console.log("| =========")

    return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )

    const lendingPoolAddress =
        await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )
    return lendingPool
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
