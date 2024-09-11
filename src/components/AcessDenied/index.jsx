import { Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const AcessDenied = () => {
    return (
        <>
            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                textAlign="center"
                fontFamily="poppins"
                mt="20px"
            >
                <Heading>Acesso Negado!</Heading>
                <Text>Você não tem permissão para acessar esta funcionalidade, caso seja necessário entre em contato com o seu Administrador.</Text>
                <Link to="/"><b>Voltar para a página inicial</b></Link>
            </Flex>
        </>
    )
}

export default AcessDenied