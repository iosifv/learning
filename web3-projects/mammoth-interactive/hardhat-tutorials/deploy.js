async function main() {
    const MyContract = await hre.ethers.getContractFactory("MyContract");

    const myContractDeployed = await MyContract.deploy("MyContractName", "MCN");

    await myContractDeployed.deployed();

    console.log("Deployed MyContract to: ", myContractDeployed.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })