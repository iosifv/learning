const { ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", async function () {
          let raffle, raffleEntranceFee, deployer
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              // This is not in the staging deployments?? why?
              //   await deployments.fixture(["all"])

              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  /** Enter the Raffle */
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLatestTimestamp()
                  const accounts = await ethers.getSigners()

                  /** I moved this here because it wasn't finding the init */
                  const winnerStartingBalance = await accounts[0].getBalance()

                  /** Set up the listener, just in case the blockchain moves really fast */
                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Event: WinnerPicked was found!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimestamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })

                      /** Entering the Raffle */
                      console.log("Entering Raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)

                      console.log("Ok, time to wait...")

                      /** This code WON'T complete until our listener has finished listening! */
                  })
              })
          })
      })
