import * as fs from "fs"
// @ts-ignore
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"


async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  // Get the last proposal for the network. You could also change it for your index
  const proposalId = proposals[network.config.chainId!].at(-1);

  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1
  const reason = "I lika do da cha cha"
  await vote(proposalId, voteWay, reason)

  console.log("Voted! Ready to go!")
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string) {
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(
        proposalId, 
        voteWay, 
        reason
    )
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)

    const proposalStateBefore = await governor.state(proposalId)
    console.log(`Proposal State BEFORE: ${proposalStateBefore}`)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }

    const proposalStateAfter = await governor.state(proposalId)
    console.log(`Proposal State AFTER: ${proposalStateAfter}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })