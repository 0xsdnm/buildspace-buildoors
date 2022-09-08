import { Button, Container, VStack, Heading, Text, Center, HStack, Image } from '@chakra-ui/react'
import { FC, MouseEventHandler, useCallback } from 'react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

const Connected: FC = () => {
  const modalState = useWalletModal()
  const { wallet, connect } = useWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (event.defaultPrevented) return

      if (!wallet) {
        modalState.setVisible(true)
      } else {
        connect().catch(() => {})
      }
    },
    [wallet, connect, modalState]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as='h1'
            size='2xl'
            noOfLines={2}
            textAlign="center"
          >
            Welcome to the buildoor program
          </Heading>

          <Text textAlign="center">
            These are the buildoors
          </Text>
        </VStack>
      </Container>

      <HStack>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px">
        <Text>mint buildoor</Text>
      </Button>
    </VStack>
  )
}

export default Connected
