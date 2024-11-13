const { expect } = require('chai');

describe("MyContract", function () {

    it("returns correct name", async function () {

        const MyContract = await hre.ethers.getContractFactory("MyContract");
        const myContractDeployed = await MyContract.deploy("My contract NAME", "MCN");

        await myContractDeployed.deployed();

        expect(await myContractDeployed.name()).to.equal("My contract NAME");
    });

    // npx hardhat test

});