import React from 'react'
import './index.css'
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import SidebarItem from '../../components/SidebarItem';
import { FaHome } from 'react-icons/fa';

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

        <Heading>Bem vindo, Super-Admin!</Heading>
        <Stack spacing={3} textAlign="center">
          <Text >
            Esta é a primeira versão do sistema de gerenciamento de provedores.
            Você pode encontrar as funcionalidades disponíveis no sidemenu ao lado esquerdo.
          </Text>
        </Stack>
        <Stack spacing={4} direction='column' align='center' gap='4px' mt="12px">
          {/* <Link to='/users'>
            <SidebarItem Icon={FaHome} Text="Início" />
            <Button width={350} colorScheme='blue' variant='solid' size='lg'>
              Gerenciamento de Usuários
            </Button>
          </Link>
          <Link to='/roles'>
            <Button width={350} colorScheme='blue' variant='solid' size='lg'>
              Gerenciamento de Roles
            </Button>
          </Link>
          <Link to="/companies">
            <Button width={350} colorScheme='blue' variant='solid' size='lg'>
              Gerenciamento de Empresas
            </Button>
          </Link>
          <Button width={350} colorScheme='blue' variant='solid' size='lg'>
            Minhas Permissões
          </Button> */}
        </Stack>
      </Flex>
    </>
  )
}

export default Home