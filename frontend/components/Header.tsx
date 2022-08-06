import React from "react"
import styled from "styled-components"
import Image from "next/image"

const Container = styled.header`
  width: 100vw;
  height: 120px;
  padding: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.32);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = () => {
  return (
    <Container>
      <Image src="/logo.png" width={212} height={56} />
    </Container>
  )
}

export default Header
