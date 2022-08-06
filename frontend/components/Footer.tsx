import React from "react"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"

const CreditContainer = styled.div`
  position: relative;
  bottom: 0;
  padding: 50px 15px;
  text-align: center;
  color: #bbb;
  font-size: 0.8rem;
  & svg {
    color: rgb(247, 2, 119);
  }
  & a {
    color: rgb(30, 161, 241);
    font-weight: bold;
    text-decoration: none;
  }
  & > div:nth-child(2) {
    margin-top: 7px;
    & > a {
      color: #777;
      margin: 0 7px;
    }
  }
`

const Footer = () => {
  return (
    <CreditContainer>
      <div>
        Made with <FontAwesomeIcon width={12} height={12} icon={faHeart} />{" "}
        during ETHGlobal metabolism hackathon 2022 , Let's hack 🦄!!
      </div>
    </CreditContainer>
  )
}

export default Footer
