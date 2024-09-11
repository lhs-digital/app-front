import React from 'react'
import './index.css'
import Header from '../../components/Header';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

const Home = () => {
  const { user, permissions } = useContext(AuthContext)

  return (
    <>
      <Header />
      <Flex
        align="center"
        justify="center"
        flexDirection="column"
        fontSize="20px"
        fontFamily="poppins"
        mt="20px"
      >

        <Heading>Bem vindo, {user?.user.name}!</Heading>
        <Stack spacing={3} textAlign="center">
          <Text>
            Esta é a primeira versão do sistema de gerenciamento de provedores.
            Você pode encontrar as funcionalidades disponíveis no sidemenu ao lado esquerdo.
          </Text>

        </Stack>
      </Flex>
    </>
  )
}

export default Home