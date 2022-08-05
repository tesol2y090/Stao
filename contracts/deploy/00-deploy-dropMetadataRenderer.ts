import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployDropMetadataRenderer: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying DropMetadataRenderer and waiting for confirmations...")
  const dropMetadataRenderer = await deploy("DropMetadataRenderer", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(
    `editionMetadataRenderer contract was deploy at ${dropMetadataRenderer.address}`
  )
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(dropMetadataRenderer.address, [])
  }
}

export default deployDropMetadataRenderer
deployDropMetadataRenderer.tags = ["all", "dropMetadataRenderer"]
