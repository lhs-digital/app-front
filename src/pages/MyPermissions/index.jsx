import React from 'react'
import Header from '../../components/Header'
import { Box, Checkbox, Divider, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
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

                <Box textAlign="justify" px={2}>
                    {permissions.length > 0 ? (
                        permissions.map((permission, index) => (
                            <>
                                <Grid key={index} alignItems='center' gap={3}>
                                    {permission.category !== permissions[index - 1]?.category && (
                                        <>
                                            <b>{permission.category}</b>
                                        </>
                                    )}
                                    <Flex alignItems='center' gap={2}>

                                        <Checkbox isChecked={true} disabled />
                                        <Text>{permission.label}</Text>
                                    </Flex>

                                </Grid>
                            </>
                        )
                        )
                    ) : (
                        <span>Você não possui permissões</span>
                    )}
                </Box>
            </Flex>
        </>
    )
}

export default MyPermissions