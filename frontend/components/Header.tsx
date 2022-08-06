import React from "react"
import Link from "next/link"
import styled from "styled-components"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { useRouter } from "next/router"

const Container = styled.header`
  width: 100vw;
  height: 120px;
  padding: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.32);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Menu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const MenuItem = styled.a<{ active?: boolean }>`
  margin: 0 12px;
  font-size: 20px;
  color: ${(props) => (props.active ? `#BCFFD7` : "#fff")};
  padding-bottom: 8px;
  border-bottom: ${(props) => (props.active ? "4px solid #BCFFD7" : "")};
`

const Header = () => {
  const { pathname } = useRouter()
  return (
    <Container>
      <Image src="/logo.png" width={212} height={56} />
      <Menu>
        <Link href="/">
          <MenuItem active={pathname === "/"}>Explore</MenuItem>
        </Link>
        <Link href="/create">
          <MenuItem active={pathname === "/create"}>Create</MenuItem>
        </Link>
      </Menu>
      <ConnectButton />
    </Container>
  )
}

export default Header
