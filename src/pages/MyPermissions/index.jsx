import React from 'react'
import Header from '../../components/Header'
import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

const MyPermissions = () => {
    const { permissions } = useContext(AuthContext)

    return (
        <>
            <Header />
            <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
                mt="20px"
            >

                <Heading>Minhas Permissões:</Heading>
                <Text width="60%" textAlign="center">
                    {permissions.length > 0 ? (
                        permissions.map((permission, index) => (
                            <span key={index}>
                                {permission.name}
                                {index < permissions.length - 1 && ", "}
                            </span>
                        ))
                    ) : (
                        <span>Você não possui permissões</span>
                    )}
                </Text>
            </Flex>
        </>
    )
}

export default MyPermissions