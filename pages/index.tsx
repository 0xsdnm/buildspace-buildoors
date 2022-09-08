import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Box, Center, Spacer, VStack } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import NavBar from '../components/NavBar'
import Disconnected from '../components/Disconnected'
import Connected from '../components/Connected'

const Home: NextPage = () => {
  const { connected } = useWallet()
  return (
    <div className={styles.container}>
      <Head>
        <title>Buildoors</title>
        <meta name="The NFT collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={ connected ? "" : "url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <VStack w="full" h="calc(100vh)" justify="center">
          <NavBar />

          <Spacer />

          <Center>
            { connected ? <Connected/> : <Disconnected/> }
          </Center>

          <Spacer />

          <Box marginBottom={4} color="white">
            build with
            <a
              href="https://twitter.com/_buildspace"
              target="blank"
              rel="noopener noreferrer"
            >
              @buildspace
            </a>
          </Box>
        </VStack>
      </Box>
    </div>
  )
}

export default Home
