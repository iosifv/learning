import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";

const deployGovernanceToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments} = hre;
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    log("\nDeploying Governance Token...");
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations: 2
    });
    log('Deployed Governance token to addres: ' +  governanceToken.address)
    // verify()

    await delegate(governanceToken.address, deployer);
    log("Delegated!")
}

// When this is called it means: "hey you can use my vote"
const delegate = async (
    governanceTokenAddress: string, 
    delegatedAccount: string
) => {
    const governanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    );

    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)

    console.log(
        `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
        )
}

export default deployGovernanceToken;