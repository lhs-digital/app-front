import React from 'react'
import Header from '../../components/Header'
import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

const MyPermissions = () => {
    const { permissions } = useContext(AuthContext)
    
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

                <Heading>Minhas Permissões:</Heading>
                <Stack spacing={3} textAlign="center">

                    <Text>
                        {
                            permissions.length > 0 ? (
                                permissions.map(permission => {
                                    return (
                                        <Text key={permission.id}>{permission.name}</Text>
                                    )
                                })
                            ) : (
                                <Text>Você não possui permissões</Text>
                            )
                        }
                    </Text>
                </Stack>
            </Flex>
        </>
    )
}

export default MyPermissions