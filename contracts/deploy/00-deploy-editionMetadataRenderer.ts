import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployEditionMetadataRenderer: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying SharedNFTLogic and waiting for confirmations...")
  const sharedNFTLogic = await deploy("SharedNFTLogic", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(
    `editionMetadataRenderer contract was deploy at ${sharedNFTLogic.address}`
  )
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(sharedNFTLogic.address, [])
  }

  log("----------------------------------------------------")
  log("Deploying EditionMetadataRenderer and waiting for confirmations...")
  const editionMetadataRenderer = await deploy("EditionMetadataRenderer", {
    from: deployer,
    args: [sharedNFTLogic.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(
    `editionMetadataRenderer contract was deploy at ${editionMetadataRenderer.address}`
  )
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(editionMetadataRenderer.address, [])
  }
}
export default deployEditionMetadataRenderer
deployEditionMetadataRenderer.tags = ["all", "editionMetadataRenderer"]
