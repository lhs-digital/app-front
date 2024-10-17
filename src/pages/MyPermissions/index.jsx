import React from 'react'
import Header from '../../components/Header'
import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import Title from '../../components/Title'

const MyPermissions = () => {
    const { permissions } = useContext(AuthContext)

    return (
        <>
            <Header />
            <Title title="Minhas Permissões" subtitle="Visualização das suas permissões" />
            <Flex
                fontSize="20px"
                mt="20px"
                marginX="auto"
                maxWidth="800px"
            >

                <Text textAlign="justify" px={2}>
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