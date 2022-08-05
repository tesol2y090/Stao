import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import {
  networkConfig,
  developmentChains,
  STAOCONFIG,
} from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployStao: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const zoraCreator = await get("ZoraNFTCreatorV1")

  log("----------------------------------------------------")
  log("Deploying Stao and waiting for confirmations...")
  const stao = await deploy("Stao", {
    from: deployer,
    args: [
      STAOCONFIG.name,
      STAOCONFIG.symbol,
      STAOCONFIG.amountPerContributor,
      STAOCONFIG.maxContributors,
      STAOCONFIG.minDelay,
      STAOCONFIG.quorumPercentage,
      STAOCONFIG.votingPeriod,
      STAOCONFIG.votingDelay,
      zoraCreator.address,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`stao contract was deploy at ${stao.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(stao.address, [
      STAOCONFIG.name,
      STAOCONFIG.symbol,
      STAOCONFIG.amountPerContributor,
      STAOCONFIG.maxContributors,
      STAOCONFIG.minDelay,
      STAOCONFIG.quorumPercentage,
      STAOCONFIG.votingPeriod,
      STAOCONFIG.votingDelay,
      zoraCreator.address,
    ])
  }
}
export default deployStao
deployStao.tags = ["all", "stao"]
