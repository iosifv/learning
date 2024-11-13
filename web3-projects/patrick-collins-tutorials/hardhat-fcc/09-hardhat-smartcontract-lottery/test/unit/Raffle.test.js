const { deployments, ethers, getNamedAccounts, getChainId, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              // run through our deployments in the /deployments folder using the tag "all"
              await deployments.fixture(["all"])

              // Get the most recently deployed Raffle contract
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", function () {
              it("initializes the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you don't pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughEthEntered"
                  )
              })
              it("records player when they enter", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(deployer, playerFromContract)
              })
              it("emits event on enter", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })
              it("doesn't allow entrance when raffle is calculating", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  // we pretend to be a keeper for a second
                  await raffle.performUpkeep([])
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__NotOpen"
                  )
              })
          })

          describe("checkUpkeep", function () {
              it("returns false if no one has sent any ETH", async () => {
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  // Because it's a public function, instead of a transaction we just simulate with a static call
                  // Empty object == "0x" == []
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(!upkeepNeeded)
              })
              it("returns false if raffle isn't open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert.equal(raffleState.toString() == "1", upkeepNeeded == false)
              })
              it("returns false if enough time hasn't passed", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(!upkeepNeeded)
              })
              it("returns true if enough time has passed, has players, eth, and is open", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", function () {
              it("can only run if checkupkeep is true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const tx = await raffle.performUpkeep("0x")
                  assert(tx)
              })
              it("reverts if checkup is false", async () => {
                  await expect(raffle.performUpkeep("0x")).to.be.revertedWith(
                      "Raffle__UpkeepNotNeeded"
                  )
              })
              it("updates the raffle state and emits a requestId", async () => {
                  // Too many asserts in this test!
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const txResponse = await raffle.performUpkeep("0x")
                  const txReceipt = await txResponse.wait(1)
                  const raffleState = await raffle.getRaffleState()
                  const requestId = txReceipt.events[1].args.requestId
                  assert(requestId.toNumber() > 0)
                  assert(raffleState == 1)
                  assert(raffleState.toString() == "1")
              })
          })

          describe("fulfillRandomWords", function () {
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
              })
              it("can only be called after performUpkeep", async () => {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
                  ).to.be.revertedWith("nonexistent request")
              })

              // This test is too big...
              it("picks a winner, resets, and sends money", async () => {
                  const additionalEntrants = 3
                  const startingAccountIndex = 1 // Because deployer is account 0
                  const accounts = await ethers.getSigners()

                  const debugPrintAccount = async function (accountIndex) {
                      console.log(
                          "Account #" +
                              accountIndex +
                              ": " +
                              accounts[accountIndex].address +
                              " => " +
                              ethers.utils.formatEther(await accounts[accountIndex].getBalance())
                      )
                  }
                  const debugPrintAllAccounts = async function (title, limit) {
                      console.log("\n" + title + ": ")
                      for (let i = 0; i < limit; i++) {
                          await debugPrintAccount(i)
                      }
                      console.log("")
                  }

                  await debugPrintAllAccounts("Initial accounts", 4)

                  /** Connect 3 additional entrants to this raffle for a total of 4 */
                  for (
                      let i = startingAccountIndex;
                      i < startingAccountIndex + additionalEntrants;
                      i++
                  ) {
                      const accountConnectedRaffle = raffle.connect(accounts[i])
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }
                  console.log("Raffle Entrance fee: " + ethers.utils.formatEther(raffleEntranceFee))
                  await debugPrintAllAccounts("Entered Raffle", 4)
                  const startingTimeStamp = await raffle.getLatestTimestamp()

                  /**
                   * performUpkeep - mock being Chainlink Keepers
                   * fulfilRandomWords - mock being Chainlink VRF
                   * We will have to wait for the fulfillRandomWords to be called
                   */
                  await new Promise(async (resolve, reject) => {
                      /**
                       * Listen for the "winnerpicked" event
                       * JS Note: the outside promise is waiting for the async function to be resolved
                       */
                      raffle.once("WinnerPicked", async () => {
                          console.log("Event: WinnerPicked was found!")
                          /**
                           * assert throws an error if it fails, so we need to wrap it in a try/catch
                           * so that the promise returns event if it fails.
                           */
                          try {
                              // Now lets get the ending values...
                              const recentWinner = await raffle.getRecentWinner()

                              await debugPrintAllAccounts("Winner picked", 4)
                              console.log(" =>")
                              console.log("Winner Acc: " + recentWinner)

                              const raffleState = await raffle.getRaffleState()
                              //   const winnerBalance = await accounts[2].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimestamp()

                              const numPlayers = await raffle.getNumberOfPlayers()

                              const winnerEndingBalance = await accounts[1].getBalance()
                              assert.equal(numPlayers.toString(), "0")

                              assert.equal(raffleState, 0)
                              assert(endingTimeStamp > startingTimeStamp)

                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance
                                      .add(
                                          raffleEntranceFee
                                              .mul(additionalEntrants)
                                              .add(raffleEntranceFee)
                                      )
                                      .toString()
                              )
                              //   await expect(raffle.getPlayer(0)).to.be.reverted
                              //   assert.equal(recentWinner.toString(), accounts[2].address)
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                          resolve()
                      })

                      /**
                       * Set up the listener, then we will fire the event
                       * and the listener will pick it up and resolve it
                       */

                      /** Mocking Chainlink Keepers */
                      const tx = await raffle.performUpkeep([])
                      const txReceipt = await tx.wait(1)

                      /** Because it's deterministic, the winner will allways be account #1 */
                      const winnerStartingBalance = await accounts[1].getBalance()

                      /** Mocking Chainlink VRF */
                      console.log("Event: WinnerPicked is about to be fired!")
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          raffle.address
                      )
                  })
              })
          })
      })
