import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployFeeToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying DropMetadataRenderer and waiting for confirmations...")
  const feeToken = await deploy("ERC20", {
    from: deployer,
    args: ["Fee Token", "FTKO"],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`feeToken contract was deploy at ${feeToken.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(feeToken.address, [])
  }
}

export default deployFeeToken
deployFeeToken.tags = ["all", "feeToken"]
