import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployERC721TransferHelper: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const zmm = await get("ZoraModuleManager")

  log("----------------------------------------------------")
  log("Deploying ERC721TransferHelper and waiting for confirmations...")
  const erc721TransferHelper = await deploy("ERC721TransferHelper", {
    from: deployer,
    args: [zmm.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(
    `erc721TransferHelper contract was deploy at ${erc721TransferHelper.address}`
  )
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(erc721TransferHelper.address, [])
  }
}

export default deployERC721TransferHelper
deployERC721TransferHelper.tags = ["all", "erc721TransferHelper"]
deployERC721TransferHelper.dependencies = ["zoraModuleManager"]
