import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from "wagmi"
import styled from "styled-components"
import StaoImplement from "../abi/StaoImplement.json"
import StaoGovernor from "../abi/StaoGovernor.json"
import { ProjectState, ProposalState } from "../types"
import { mapProjectStateToEncodeFunction, shortAddress } from "../helper"
import { ethers } from "ethers"
import EditionSizeComponent from "./ProjectSetting/EditionSize"
import RoyaltyBPSComponent from "./ProjectSetting/RoyaltyBPS"

const Container = styled.div`
  background: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0.25) 0%,
    rgba(217, 217, 217, 0) 0.01%
  );
  backdrop-filter: blur(50px);
  border-radius: 12px;

  padding: 28px;
  border: 1px solid #2ec747;
  width: 500px;

  .amount {
    text-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
    font-size: 32px;
    margin: 16px;
    display: flex;
    align-items: center;

    .dot-green {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #22da40e4;
      margin-right: 24px;
    }
  }
`

const SettingCard = ({
  projectState,
  projectContract,
  projectGovernance,
  projectImplement,
  projectOwner,
}: any) => {
  const staoImplementContract = new ethers.ContractFactory(
    StaoImplement.abi,
    projectImplement
  )
  const staoGovernContractConfig = {
    addressOrName: projectGovernance as string,
    contractInterface: StaoGovernor.abi,
  }

  const { data, isError, isLoading }: any = useContractReads({
    watch: true,
    contracts: [
      {
        ...projectContract,
        functionName: "proposeToId",
        args: mapProjectStateToEncodeFunction[projectState],
      },
    ],
  })

  const [proposalId] = data || ["0"]

  return (
    <Container>
      <div className="amount">
        <div className="dot-green" />
        {ProjectState[projectState]}
      </div>
      {projectState === ProjectState.SetEditionSize && (
        <EditionSizeComponent
          proposalId={proposalId}
          projectContract={projectContract}
          projectGovernance={projectGovernance}
          projectImplement={projectImplement}
          projectOwner={projectOwner}
          staoImplementContract={staoImplementContract}
          staoGovernContractConfig={staoGovernContractConfig}
        />
      )}
      {projectState === ProjectState.SetRoyaltyBPS && (
        <RoyaltyBPSComponent
          proposalId={proposalId}
          projectContract={projectContract}
          projectGovernance={projectGovernance}
          projectImplement={projectImplement}
          projectOwner={projectOwner}
          staoImplementContract={staoImplementContract}
          staoGovernContractConfig={staoGovernContractConfig}
        />
      )}
    </Container>
  )
}

export default SettingCard
