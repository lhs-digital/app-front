import React from 'react'
import Header from '../../components/Header'
import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
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
                gap="24px"
                width="100%"
                paddingX="24px"
            >
                <Stack width="800px">

                    <Heading mt='12px'>Gerenciamento de Roles</Heading>
                    <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                    <Heading fontSize="lg" fontWeight="regular" color="gray.500">Visualização e gestão das permissões atribuídas a você</Heading>
                </Stack>
            </Flex>
            <Flex
                fontSize="20px"
                mt="20px"
                marginX="auto"
                width="800px"
            >

                <Text textAlign="justify">
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