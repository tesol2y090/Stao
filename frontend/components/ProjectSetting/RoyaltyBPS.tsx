import { useState } from "react"
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from "wagmi"
import styled from "styled-components"
import { ethers } from "ethers"
import { ProjectState, ProposalState } from "../../types"
import { mapProjectStateToEncodeFunction, shortAddress } from "../../helper"

const CreateButton = styled.button`
  background: linear-gradient(
    90deg,
    #28a2b6 35.77%,
    rgba(76, 184, 121, 0.950611) 80.16%
  );
  color: #fff;
  outline: none;
  border: none;
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  cursor: pointer;

  &:hover {
    opacity: 0.83;
  }
`

const OutlineButton = styled.button`
  background: transparent;
  border-radius: 12px;
  outline: none;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  cursor: pointer;
  color: #bcffd7;
  border: 1px solid #bcffd7;

  &:hover {
    opacity: 0.83;
  }
`

const Row = styled.div`
  color: #8991dc;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px;
`

const InputText = styled.input`
  background: rgba(168, 174, 186, 0.2);
  border-radius: 8px;
  width: 100%;
  height: 40px;
  color: #fff;
  padding: 12px;
  margin-top: 8px;
  outline: none;
  border: none;

  &:focus {
    border: 1px solid #abffb5;
  }
`

const RoyaltyBPSComponent = ({
  proposalId,
  projectContract,
  projectGovernance,
  projectImplement,
  projectOwner,
  staoImplementContract,
  staoGovernContractConfig,
}: any) => {
  const { address } = useAccount()
  const [royaltyBPS, setRoyaltyBPS] = useState<number>(0)
  const [description, setDescription] = useState<string>("")

  const {
    data: governorData,
    isError,
    isLoading,
  }: any = useContractReads({
    watch: true,
    contracts: [
      {
        ...staoGovernContractConfig,
        functionName: "state",
        args: [proposalId],
      },
      {
        ...staoGovernContractConfig,
        functionName: "proposalVotes",
        args: [proposalId],
      },
      {
        ...projectContract,
        functionName: "royaltyBPS",
      },
      {
        ...projectContract,
        functionName: "maxContributors",
      },
    ],
  })

  const { config: proposConfig } = usePrepareContractWrite({
    ...projectContract,
    functionName: "proposeRoyaltyBPS",
    args: [
      royaltyBPS,
      staoImplementContract.interface.encodeFunctionData("setRoyaltyBPS", [
        royaltyBPS,
      ]),
      description,
    ],
  })
  const { write: onPropose } = useContractWrite(proposConfig)

  const { config: voteForConfig } = usePrepareContractWrite({
    ...staoGovernContractConfig,
    functionName: "castVote",
    args: [proposalId, 1],
  })
  const { write: onVoteFor } = useContractWrite(voteForConfig)

  const { config: voteAgainrsConfig } = usePrepareContractWrite({
    ...staoGovernContractConfig,
    functionName: "castVote",
    args: [proposalId, 0],
  })
  const { write: onVoteAgaints } = useContractWrite(voteAgainrsConfig)

  const { config: queueProposalConfig } = usePrepareContractWrite({
    ...projectContract,
    functionName: "queueProposal",
  })
  const { write: onQueueProposal } = useContractWrite(queueProposalConfig)

  const { config: executeProposalConfig } = usePrepareContractWrite({
    ...projectContract,
    functionName: "executeProposal",
  })
  const { write: onExecuteProposal } = useContractWrite(executeProposalConfig)

  const [proposalStat, proposalVote, royaltyBPSContract, maxContributors] =
    governorData || [
      "0",
      { abstainVotes: 0, againstVotes: 0, forVotes: 0 },
      0,
      0,
    ]

  return (
    <>
      {projectOwner === address ? (
        <>
          {proposalId.toString() === "0" ? (
            <>
              <Row>
                <span>Royalty Percent Fee:</span>
                <span>
                  <InputText
                    value={royaltyBPS}
                    onChange={(e) => setRoyaltyBPS(Number(e.target.value))}
                  />
                </span>
              </Row>
              <Row>
                <span>Proposal Description:</span>
                <span>
                  <InputText
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </span>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <span>Proposal Id:</span>
                <span>{shortAddress(proposalId.toString())}</span>
              </Row>
              <Row>
                <span>Royalty Fee Percent:</span>
                <span>{royaltyBPSContract.toString()}</span>
              </Row>
              <Row>
                <span>Vote For:</span>
                <span>
                  {ethers.utils.formatEther(proposalVote.forVotes.toString())}
                </span>
              </Row>
              <Row>
                <span>Vote Agianst:</span>
                <span>
                  {ethers.utils.formatEther(
                    proposalVote.againstVotes.toString()
                  )}
                </span>
              </Row>
              <Row>
                <span>Vote Abstain:</span>
                <span>
                  {ethers.utils.formatEther(
                    proposalVote.abstainVotes.toString()
                  )}
                </span>
              </Row>
              <Row>
                <span>Total Vote:</span>
                <span>{maxContributors.toString()}</span>
              </Row>
              <Row>
                <span>Status:</span>
                <span>{ProposalState[proposalStat]}</span>
              </Row>
            </>
          )}
          {proposalId.toString() === "0" && (
            <CreateButton onClick={() => onPropose?.()}>Propose</CreateButton>
          )}
          {proposalId.toString() !== "0" &&
            proposalStat === ProposalState.Succeeded && (
              <CreateButton onClick={() => onQueueProposal?.()}>
                Queue
              </CreateButton>
            )}
          {proposalId.toString() !== "0" &&
            proposalStat === ProposalState.Queued && (
              <CreateButton onClick={() => onExecuteProposal?.()}>
                Executed
              </CreateButton>
            )}
        </>
      ) : (
        <>
          {proposalId.toString() === "0" ? (
            <>
              <div style={{ color: "yellow", textAlign: "center" }}>
                <h5>
                  "Project Owner will proposing Royalty Percent prarameter"
                </h5>
              </div>
            </>
          ) : (
            <>
              <Row>
                <span>Proposal Id:</span>
                <span>{shortAddress(proposalId.toString())}</span>
              </Row>
              <Row>
                <span>Royalty Percent:</span>
                <span>{royaltyBPSContract.toString()}</span>
              </Row>
              <Row>
                <span>Vote For:</span>
                <span>
                  {ethers.utils.formatEther(proposalVote.forVotes.toString())}
                </span>
              </Row>
              <Row>
                <span>Vote Agianst:</span>
                <span>
                  {ethers.utils.formatEther(
                    proposalVote.againstVotes.toString()
                  )}
                </span>
              </Row>
              <Row>
                <span>Vote Abstain:</span>
                <span>
                  {ethers.utils.formatEther(
                    proposalVote.abstainVotes.toString()
                  )}
                </span>
              </Row>
              <Row>
                <span>Total Vote:</span>
                <span>{maxContributors.toString()}</span>
              </Row>
              <Row>
                <span>Status:</span>
                <span>{ProposalState[proposalStat]}</span>
              </Row>
            </>
          )}
          {projectOwner !== address && proposalStat === ProposalState.Active && (
            <>
              <CreateButton onClick={() => onVoteFor?.()}>
                Vote For
              </CreateButton>
              <OutlineButton onClick={() => onVoteAgaints?.()}>
                Vote Agianst
              </OutlineButton>
            </>
          )}
        </>
      )}
    </>
  )
}

export default RoyaltyBPSComponent
