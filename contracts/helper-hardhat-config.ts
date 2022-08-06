import { ethers } from "hardhat"
import BigNumber from "bignumber.js"

export interface networkConfigItem {
  ethUsdPriceFeed?: string
  blockConfirmations?: number
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export interface staoConfigDev {
  name: string
  symbol: string
  description: string
  amountPerContributor: string
  maxContributors: number
  minDelay: number
  quorumPercentage: number
  votingPeriod: number
  votingDelay: number
}

export interface SalesConfiguration {
  publicSalePrice: number
  maxSalePurchasePerAddress: number
  publicSaleStart: number
  publicSaleEnd: number
  presaleStart: number
  presaleEnd: number
  presaleMerkleRoot: string
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  kovan: {
    blockConfirmations: 6,
  },
  mumbai: {
    blockConfirmations: 10,
  },
}

export const developmentChains = ["hardhat", "localhost"]
export const proposalsFile = "proposals.json"

// Governor Values
export const QUORUM_PERCENTAGE = 50 // Need 4% of voters to pass
export const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
export const VOTING_PERIOD = 10 // blocks
export const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active

export const STAOCONFIG: staoConfigDev = {
  name: "Test Stao",
  symbol: "TSTAO",
  description: "test description",
  amountPerContributor: ethers.utils.parseEther("1").toString(),
  maxContributors: 2,
  minDelay: MIN_DELAY,
  quorumPercentage: QUORUM_PERCENTAGE,
  votingPeriod: VOTING_PERIOD,
  votingDelay: VOTING_DELAY,
}

export const STAO_DEV_PARAMS = {
  editionSize: 10,
  royaltyBPS: 20,
  saleConfig: {
    publicSalePrice: ethers.utils.parseEther("0.1").toString(),
    maxSalePurchasePerAddress: 1,
    publicSaleStart: 150,
    publicSaleEnd: 200,
    presaleStart: 0,
    presaleEnd: 0,
    presaleMerkleRoot: ethers.utils.formatBytes32String("presaleMerkleRoot"),
  },
  animationURI: "animationURI",
  imageURI: "imageURI",
  isVoteCompleted: true,
}

export const ZORA_FEE_MANAGER = {
  defaultFeeBPS: 0,
}
