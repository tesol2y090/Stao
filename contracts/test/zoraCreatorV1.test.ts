import { ZoraNFTCreatorV1, ZoraNFTCreatorV1__factory } from "../typechain-types"
import { deployments, ethers } from "hardhat"
import { Signer } from "ethers"
import { assert, expect } from "chai"
import { STAOCONFIG, STAO_DEV_PARAMS } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

describe("ZoraNFTCreatorV1", async () => {
  let zora: ZoraNFTCreatorV1

  // Accounts
  let deployer: Signer
  let alice: Signer
  let bob: Signer
  let dev: Signer

  // Stao Contract
  let zoraAsAlice: ZoraNFTCreatorV1

  beforeEach(async () => {
    await deployments.fixture(["all"])
    ;[deployer, alice, bob, dev] = await ethers.getSigners()

    const zoraDeployment = await deployments.get("ZoraNFTCreatorV1")
    zora = (await ethers.getContractAt(
      zoraDeployment.abi,
      zoraDeployment.address
    )) as ZoraNFTCreatorV1

    // Connect Stao Contract to signer
    zoraAsAlice = ZoraNFTCreatorV1__factory.connect(zora.address, alice)
  })

  it("Should create NFT successfully", async () => {
    const implementContract = await zora.implementation()
    await zoraAsAlice.createEdition(
      "Name",
      "Simbol",
      STAO_DEV_PARAMS.editionSize,
      STAO_DEV_PARAMS.royaltyBPS,
      await alice.getAddress(),
      await alice.getAddress(),
      STAO_DEV_PARAMS.saleConfig,
      "Desciption",
      STAO_DEV_PARAMS.animationURI,
      STAO_DEV_PARAMS.imageURI,
      {
        gasLimit: ethers.utils.parseUnits("0.03", "gwei"),
      }
    )
  })
})
