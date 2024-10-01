import React from 'react'
import './index.css'
import Header from '../../components/Header';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import ListActivities from '../../components/ListActivities/ListActivities';

const Home = () => {
  const { user } = useContext(AuthContext)

  return (
    <>
      <Header width="100%" />
      <Flex
        align="center"
        justify="center"
        flexDirection="column"
        fontSize="20px"
        fontFamily="poppins"
        mt="20px"
        gap="24px"
        width="100%"
        paddingX="24px"
      >

        <Stack maxWidth="800px">
          <Heading>Bem vindo, {user?.user.name}!</Heading>
          <Text textAlign="justify" >
            Esta é a primeira versão do sistema de gerenciamento de provedores.
            Você pode encontrar as funcionalidades disponíveis no sidemenu ao lado esquerdo.
          </Text>

        </Stack>

        <ListActivities />
      </Flex>
    </>
  )
}

export default Home