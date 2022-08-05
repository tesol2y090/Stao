import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import {
  networkConfig,
  developmentChains,
  ZORA_FEE_MANAGER,
} from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployERC721Drop: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying FactoryUpgradeGate and waiting for confirmations...")
  const factoryUpgradeGate = await deploy("FactoryUpgradeGate", {
    from: deployer,
    args: [deployer],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`stao contract was deploy at ${factoryUpgradeGate.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(factoryUpgradeGate.address, [deployer])
  }

  log("----------------------------------------------------")
  log("Deploying ZoraFeeManager and waiting for confirmations...")
  const zoraFeeManager = await deploy("ZoraFeeManager", {
    from: deployer,
    args: [ZORA_FEE_MANAGER.defaultFeeBPS, deployer],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`stao contract was deploy at ${zoraFeeManager.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(zoraFeeManager.address, [
      ZORA_FEE_MANAGER.defaultFeeBPS,
      deployer,
    ])
  }

  log("----------------------------------------------------")
  log("Deploying ERC721Drop and waiting for confirmations...")
  const erc721Drop = await deploy("ERC721Drop", {
    from: deployer,
    args: [
      zoraFeeManager.address,
      ethers.constants.AddressZero,
      factoryUpgradeGate,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`stao contract was deploy at ${erc721Drop.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(erc721Drop.address, [
      zoraFeeManager.address,
      ethers.constants.AddressZero,
      factoryUpgradeGate,
    ])
  }
}
export default deployERC721Drop
deployERC721Drop.tags = ["all", "erc721Drop"]
