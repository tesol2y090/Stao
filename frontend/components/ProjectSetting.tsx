import React from "react"
import styled from "styled-components"
import { ProjectState } from "../types"
import SettingCard from "./SettingCard"

const Container = styled.div`
  margin-top: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .left {
    width: 50%;
  }
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(
      158.55deg,
      #2ec747 3.02%,
      rgba(0, 0, 0, 0.85) 46.62%,
      #8991dc 80.72%
    );
    margin-right: 24px;
  }

  .header {
    font-weight: bold;
    font-size: 24px;
  }
`

const Step = styled.div<{ active?: boolean }>`
  margin-top: 12px;
  .header {
    display: flex;
    align-items: center;
    .dot {
      width: 10px;
      height: 10px;
      background: ${(props) => (props.active ? `#bcffd7` : "#828282")};
      box-shadow: ${(props) => (props.active ? `0px 0px 10px #bcffd7` : "")};
      border-radius: 50%;
      margin-right: 12px;
    }

    .title {
      font-weight: 600;
      font-size: 20px;
      color: ${(props) => (props.active ? `#abffb5` : "#4F4F4F")};
    }
  }

  &:not(:first-child) {
    .line {
      width: 2px;
      height: 65px;
      margin-left: 4px;

      background: ${(props) => (props.active ? `#abffb5` : "#828282")};
    }
  }
`

const ProjectSetting = ({
  projectState,
  projectContract,
  projectGovernance,
  projectImplement,
  projectOwner,
}: any) => {
  return (
    <Container>
      <div className="left">
        <TitleContainer>
          <div className="dot" />
          <div className="header">Project Setting</div>
        </TitleContainer>
        <div style={{ margin: "36px" }}>
          <Step active={projectState >= ProjectState.SetEditionSize}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">Edition Size</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.SetRoyaltyBPS}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">Royalty Fee</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.SetSaleConfig}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">Sale Config</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.SetAnimationURI}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">AnimationURI</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.SetImageURI}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">ImageURI</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.SetIsVoteCompleted}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">Recheck Parameter</div>
            </div>
          </Step>
          <Step active={projectState >= ProjectState.ReadyToCreateNFT}>
            <div className="line" />
            <div className="header">
              <div className="dot" />
              <div className="title">Ready For Create</div>
            </div>
          </Step>
        </div>
      </div>
      <div style={{ marginTop: "36px" }}>
        <SettingCard
          projectState={projectState}
          projectContract={projectContract}
          projectGovernance={projectGovernance}
          projectImplement={projectImplement}
          projectOwner={projectOwner}
        />
      </div>
    </Container>
  )
}

export default ProjectSetting
