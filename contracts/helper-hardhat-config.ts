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
  amountPerContributor: string
  maxContributors: number
  minDelay: number
  quorumPercentage: number
  votingPeriod: number
  votingDelay: number
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
export const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
export const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
export const VOTING_PERIOD = 5 // blocks
export const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active

export const STAOCONFIG: staoConfigDev = {
  name: "Test Stao",
  symbol: "TSTAO",
  amountPerContributor: ethers.utils.parseEther("1").toString(),
  maxContributors: 3,
  minDelay: MIN_DELAY,
  quorumPercentage: QUORUM_PERCENTAGE,
  votingPeriod: VOTING_PERIOD,
  votingDelay: VOTING_DELAY,
}

export const ZORA_FEE_MANAGER = {
  defaultFeeBPS: 0,
}
