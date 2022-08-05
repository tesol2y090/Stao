import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployZoraCreator: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const erc721Drop = await get("ERC721Drop")
  const editionMetadataRenderer = await get("EditionMetadataRenderer")
  const dropMetadataRenderer = await get("DropMetadataRenderer")

  log("----------------------------------------------------")
  log("Deploying ZoraNFTCreatorV1 and waiting for confirmations...")
  const zoraCreator = await deploy("ZoraNFTCreatorV1", {
    from: deployer,
    args: [
      erc721Drop.address,
      editionMetadataRenderer.address,
      dropMetadataRenderer.address,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`zoraCreator contract was deploy at ${zoraCreator.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(zoraCreator.address, [
      erc721Drop.address,
      editionMetadataRenderer.address,
      dropMetadataRenderer.address,
    ])
  }
}

export default deployZoraCreator
deployZoraCreator.tags = ["all", "zoraCreator"]
