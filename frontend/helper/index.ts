import { ethers } from "ethers"
import { ProjectState } from "../types"
const SET_EDITION_SIZE = ethers.utils.formatBytes32String("setEditionSize")
const SET_ROYALTY_BPS = ethers.utils.formatBytes32String("setRoyaltyBPS")
const SET_SALE_CONFIG = ethers.utils.formatBytes32String("setSaleConfig")
const SET_ANIMATION_URI = ethers.utils.formatBytes32String("setAnimationURI")
const SET_IMAGE_URI = ethers.utils.formatBytes32String("setImageURI")
const CREATE_NFT = ethers.utils.formatBytes32String("createNFT")
const SET_IS_VOTE_COMPLETED =
  ethers.utils.formatBytes32String("setIsVoteCompleted")

export const mapProjectStateToEncodeFunction: any = {
  [ProjectState.SetEditionSize]: SET_EDITION_SIZE,
  [ProjectState.SetRoyaltyBPS]: SET_ROYALTY_BPS,
  [ProjectState.SetSaleConfig]: SET_SALE_CONFIG,
  [ProjectState.SetAnimationURI]: SET_ANIMATION_URI,
  [ProjectState.SetImageURI]: SET_IMAGE_URI,
  [ProjectState.SetIsVoteCompleted]: SET_IS_VOTE_COMPLETED,
  [ProjectState.ReadyToCreateNFT]: CREATE_NFT,
}

export const shortAddress = (
  address: string | undefined,
  first = 6,
  last = -4
) => {
  return `${address?.slice(0, first)}...${address?.slice(last)}`
}
