import React from 'react'
import './index.css'
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { Button, Flex, Heading, Stack } from '@chakra-ui/react';

const Home = () => {

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

        <Heading>Bem vindo, Administrador!</Heading>
        <Stack spacing={4} direction='column' align='center' gap='4px' mt="12px">
          <Link to='/users'>
            <Button width={350} colorScheme='blue' variant='solid' size='lg'>
              Gerenciamento de Usuários
            </Button>
          </Link>
          <Button width={350} colorScheme='blue' variant='solid' size='lg'>
            Gerenciamento de Permissões
          </Button>
          <Button width={350} colorScheme='blue' variant='solid' size='lg'>
            Gerenciamento de Roles
          </Button>
          <Button width={350} colorScheme='blue' variant='solid' size='lg'>
            Gerenciamento de Empresas
          </Button>
        </Stack>
      </Flex>
    </>
  )
}

export default Home