import {
  Stao,
  Stao__factory,
  StaoGovernor,
  StaoGovernor__factory,
  StaoImplement,
  StaoImplement__factory,
} from "../typechain-types"
import { deployments, ethers } from "hardhat"
import { Signer } from "ethers"
import { assert, expect } from "chai"
import { STAOCONFIG, STAO_DEV_PARAMS } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

describe("Stao", async () => {
  let stao: Stao
  let staoGovernor: StaoGovernor
  let staoImplement: StaoImplement

  // Accounts
  let deployer: Signer
  let alice: Signer
  let bob: Signer
  let dev: Signer

  // Stao Contract
  let staoAsDeployer: Stao
  let staoAsAlice: Stao
  let staoAsBob: Stao
  let staoAsDev: Stao

  // Stao Governor Contract
  let staoGovernorAsDeployer: StaoGovernor
  let staoGovernorAsAlice: StaoGovernor
  let staoGovernorAsBob: StaoGovernor
  let staoGovernorAsDev: StaoGovernor

  const SET_EDITION_SIZE = ethers.utils.formatBytes32String("setEditionSize")
  const SET_ROYALTY_BPS = ethers.utils.formatBytes32String("setRoyaltyBPS")
  const SET_SALE_CONFIG = ethers.utils.formatBytes32String("setSaleConfig")
  const SET_ANIMATION_URI = ethers.utils.formatBytes32String("setAnimationURI")
  const SET_IMAGE_URI = ethers.utils.formatBytes32String("setImageURI")
  const CREATE_NFT = ethers.utils.formatBytes32String("createNFT")
  const SET_IS_VOTE_COMPLETED =
    ethers.utils.formatBytes32String("setIsVoteCompleted")

  // Stao
  enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed,
  }

  beforeEach(async () => {
    await deployments.fixture(["all"])
    ;[deployer, alice, bob, dev] = await ethers.getSigners()

    const staoDeployment = await deployments.get("Stao")
    stao = (await ethers.getContractAt(
      staoDeployment.abi,
      staoDeployment.address
    )) as Stao
    const staoGovernorAddress = await stao.staoGovern()
    staoGovernor = (await ethers.getContractAt(
      StaoGovernor__factory.abi,
      staoGovernorAddress
    )) as StaoGovernor
    const staoImplementAddress = await stao.staoImplement()
    staoImplement = (await ethers.getContractAt(
      StaoImplement__factory.abi,
      staoImplementAddress
    )) as StaoImplement

    // Connect Stao Contract to signer
    staoAsDeployer = Stao__factory.connect(stao.address, deployer)
    staoAsAlice = Stao__factory.connect(stao.address, alice)
    staoAsBob = Stao__factory.connect(stao.address, bob)
    staoAsDev = Stao__factory.connect(stao.address, dev)

    // Conect Stao Governor Contract to signer
    staoGovernorAsDeployer = StaoGovernor__factory.connect(
      staoGovernor.address,
      deployer
    )
    staoGovernorAsAlice = StaoGovernor__factory.connect(
      staoGovernor.address,
      alice
    )
    staoGovernorAsBob = StaoGovernor__factory.connect(staoGovernor.address, bob)
    staoGovernorAsDev = StaoGovernor__factory.connect(staoGovernor.address, dev)
  })

  it("Should contribute project successfully", async () => {
    await staoAsAlice.contribute({
      value: ethers.utils.parseEther("1"),
    })

    await staoAsBob.contribute({
      value: ethers.utils.parseEther("1"),
    })

    const aliceAmount = await stao.balanceOf(await alice.getAddress())
    const bobAmount = await stao.balanceOf(await bob.getAddress())

    expect(aliceAmount).to.be.equal(STAOCONFIG.amountPerContributor)
    expect(bobAmount).to.be.equal(STAOCONFIG.amountPerContributor)
  })

  it("Should work in real usecase", async () => {
    let proposalId
    let proposalState
    let voteCount
    let blockNumber
    let encodedFunctionCall
    await staoAsAlice.contribute({
      value: ethers.utils.parseEther("1"),
    })

    await staoAsBob.contribute({
      value: ethers.utils.parseEther("1"),
    })

    const aliceAmount = await stao.balanceOf(await alice.getAddress())
    const bobAmount = await stao.balanceOf(await bob.getAddress())

    await staoAsAlice.delegate(await alice.getAddress())
    await staoAsBob.delegate(await bob.getAddress())

    expect(aliceAmount).to.be.equal(STAOCONFIG.amountPerContributor)
    expect(bobAmount).to.be.equal(STAOCONFIG.amountPerContributor)

    // Propose Edition Size
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setEditionSize",
      [STAO_DEV_PARAMS.editionSize]
    )

    await staoAsDeployer.proposeEditionSize(
      STAO_DEV_PARAMS.editionSize,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_EDITION_SIZE)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    console.log("Before Queue")
    await staoAsDeployer.queueProposal()
    console.log("After Queue")

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)

    const newEditionSize = await staoImplement.editionSize()
    expect(newEditionSize.toNumber()).to.be.equal(STAO_DEV_PARAMS.editionSize)
    console.log("End Edition Size")

    // Propose royaltyBPS
    // =====================================================================
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setRoyaltyBPS",
      [STAO_DEV_PARAMS.royaltyBPS]
    )

    await staoAsDeployer.proposeRoyaltyBPS(
      STAO_DEV_PARAMS.royaltyBPS,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_ROYALTY_BPS)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)

    const newRoyaltyBPS = await staoImplement.royaltyBPS()
    expect(newRoyaltyBPS).to.be.equal(STAO_DEV_PARAMS.royaltyBPS)
    console.log("End RoyaltyBPS")

    // Propose saleConfig
    // =====================================================================
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setSaleConfig",
      [STAO_DEV_PARAMS.saleConfig]
    )

    await staoAsDeployer.proposeSaleConfig(
      STAO_DEV_PARAMS.saleConfig,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_SALE_CONFIG)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)

    console.log("End SaleConfig")

    // Propose AnimationURI
    // =====================================================================
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setAnimationURI",
      [STAO_DEV_PARAMS.animationURI]
    )

    await staoAsDeployer.proposeAnimationURI(
      STAO_DEV_PARAMS.animationURI,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_ANIMATION_URI)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)
    const newAnimationURI = await staoImplement.animationURI()
    expect(newAnimationURI).to.be.equal(STAO_DEV_PARAMS.animationURI)

    console.log("End AnimationURI")

    // Propose ImageURI
    // =====================================================================
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setImageURI",
      [STAO_DEV_PARAMS.imageURI]
    )

    await staoAsDeployer.proposeImageURI(
      STAO_DEV_PARAMS.imageURI,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_IMAGE_URI)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)
    const newImageURI = await staoImplement.imageURI()
    expect(newImageURI).to.be.equal(STAO_DEV_PARAMS.imageURI)

    console.log("End ImageURI")

    // Propose IsVoteCompleted
    // =====================================================================
    encodedFunctionCall = staoImplement.interface.encodeFunctionData(
      "setIsVoteCompleted",
      [STAO_DEV_PARAMS.isVoteCompleted]
    )

    await staoAsDeployer.proposeIsVoteCompleted(
      STAO_DEV_PARAMS.isVoteCompleted,
      encodedFunctionCall,
      "Description"
    )
    proposalId = await stao.proposeToId(SET_IS_VOTE_COMPLETED)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)
    const newIsVotedCompleted = await staoImplement.isVoteCompleted()
    expect(newIsVotedCompleted).to.be.equal(STAO_DEV_PARAMS.isVoteCompleted)

    console.log("End IsVoteCompleted")

    // Propose CreateNFT
    // =====================================================================
    encodedFunctionCall =
      staoImplement.interface.encodeFunctionData("createNFT")

    await staoAsDeployer.proposeCreateNFT(encodedFunctionCall, "Description")
    proposalId = await stao.proposeToId(CREATE_NFT)
    proposalState = await staoGovernor.state(proposalId)

    expect(proposalState).to.be.equal(ProposalState.Pending)

    await moveBlocks(STAOCONFIG.votingDelay + 1)

    // Vote
    await staoGovernorAsAlice.castVote(proposalId, 1)
    await staoGovernorAsBob.castVote(proposalId, 1)

    await moveBlocks(STAOCONFIG.votingPeriod + 1)

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Succeeded)

    // Queue
    await staoAsDeployer.queueProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Queued)

    // Execute
    await moveTime(STAOCONFIG.minDelay + 1)
    await moveBlocks(1)

    await staoAsDeployer.executeProposal()

    proposalState = await staoGovernor.state(proposalId)
    expect(proposalState).to.be.equal(ProposalState.Executed)
    const nftAddress = await staoImplement.staoNFT()
    console.log(nftAddress)

    console.log("End CreateNFT")
  })
})
