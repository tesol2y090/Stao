import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployZoraModuleManager: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const feeToken = await get("ERC20")

  log("----------------------------------------------------")
  log("Deploying ZoraModuleManager and waiting for confirmations...")
  const zoraModuleManager = await deploy("ZoraModuleManager", {
    from: deployer,
    args: [deployer, feeToken.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`feeToken contract was deploy at ${zoraModuleManager.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(zoraModuleManager.address, [])
  }
}

export default deployZoraModuleManager
deployZoraModuleManager.tags = ["all", "zoraModuleManager"]
deployZoraModuleManager.dependencies = ["feeToken"]
