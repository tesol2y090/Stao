import { TimeLock, Stao } from "../typechain-types"
import { ethers, deployments } from "hardhat"
import { assert, expect } from "chai"
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

describe("Governor Flow", async () => {
  let stao: Stao
  const voteWay = 1 // for
  const reason = "I lika do da cha cha"
  beforeEach(async () => {
    await deployments.fixture(["all"])
    // stao = await ethers.getContractFactory("Stao")
  })

  it("can only be changed through governance", async () => {
    console.log("GANG")
  })
})
