import React from "react"
import styled from "styled-components"
import Image from "next/image"

const Container = styled.div`
  background: linear-gradient(
    253.09deg,
    rgba(217, 217, 217, 0.25) -7.53%,
    rgba(217, 217, 217, 0) 97.04%
  );
  backdrop-filter: blur(50px);

  border: 1px solid #2ec747;
  border-radius: 12px;

  margin: 0 24px;
  width: 224px;
  padding: 16px;

  .img {
    background: linear-gradient(
      135deg,
      rgba(171, 255, 181, 0.3) 16.06%,
      rgba(0, 0, 0, 0.255) 46.47%,
      rgba(217, 198, 232, 0.255) 82.64%
    );
    opacity: 0.8;
    border-radius: 12px;
    width: 100%;
    height: 140px;
  }
`

const ProjectContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
`

const VisitButton = styled.div`
  background: linear-gradient(
    90deg,
    #28a2b6 35.77%,
    rgba(76, 184, 121, 0.950611) 80.16%
  );
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  cursor: pointer;

  &:hover {
    opacity: 0.83;
  }
`

const ProjectCard = () => {
  return (
    <Container>
      <div className="img" />
      <ProjectContent>
        <span>Project Name:</span>
        <span>NFT Generator</span>
      </ProjectContent>
      <ProjectContent>
        <span>Owner:</span>
        <span>0xasdsa...sd3</span>
      </ProjectContent>
      <ProjectContent>
        <span>Amount:</span>
        <span>0.5 ETH</span>
      </ProjectContent>
      <ProjectContent>
        <span>Remain:</span>
        <span>5</span>
      </ProjectContent>
      <ProjectContent>
        <span>Max:</span>
        <span>10</span>
      </ProjectContent>
      <VisitButton>Visit</VisitButton>
    </Container>
  )
}

export default ProjectCard
