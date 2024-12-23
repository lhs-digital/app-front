import React, { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { Avatar, Box, Button, Flex, FormControl, FormLabel, Grid, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import ModalReport from '../../components/ModalReport'
import { DeleteIcon, DownloadIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import Pagination from '../../components/Pagination'
import { AuthContext } from '../../contexts/auth'

const ReportsAud = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [refresh, setRefresh] = useState(false);
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    const { permissions } = useContext(AuthContext);

    return (
        <>
            <Header />

            <Title title="Relatórios de Auditorias" subtitle="Administração e gerenciamento dos relatórios das auditorias" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={4} px={2}>

                    {permissions.some(permissions => permissions.name === 'report_generate') ?
                        (
                            <Button colorScheme='blue' marginBottom="6px" onClick={() => onOpen()}>
                                GERAR RELATÓRIO
                            </Button>
                        )
                        : null
                    }


                    <Grid
                        templateColumns="1fr"
                        gap={4}
                        marginBottom="24px"
                    >
                        <Box>
                            <FormControl>
                                <FormLabel fontSize="lg">Filtro por Data da Auditoria</FormLabel>
                                <Flex alignItems="center" gap="6px">
                                    <Input
                                        size="lg"
                                        placeholder='Data de Auditoria'
                                        type='date'
                                    />
                                    até
                                    <Input
                                        size="lg"
                                        placeholder='Data de Auditoria'
                                        type='date'
                                    />
                                </Flex>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Box overflowY="auto" height="100%">
                        <Table mt="6">
                            <Thead>
                                <Tr>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">ID do Relatório</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Gerado por</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Gerado em</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">
                                        <Flex align="center" justify="center" height="100%">
                                            Baixar
                                        </Flex>
                                    </Th>
                                    <Th p={0}></Th>
                                    <Th p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr cursor="pointer" _hover={{ bg: "gray.100" }} >
                                    <Td maxW={isMobile ? 5 : 100} color="blue"> #3342 </Td>
                                    <Td maxW={isMobile ? 5 : 100}> jvcl@ic.ufal.br </Td>
                                    <Td maxW={isMobile ? 5 : 100}> 20/11/2024 </Td>
                                    <Td p={0}>
                                        <Flex align="center" justify="center" height="100%">
                                            <DownloadIcon fontSize={20} />
                                        </Flex>
                                    </Td>
                                </Tr>
                                <Tr cursor="pointer" _hover={{ bg: "gray.100" }} >
                                    <Td maxW={isMobile ? 5 : 100} color="blue"> #3342 </Td>
                                    <Td maxW={isMobile ? 5 : 100}> jvcl@ic.ufal.br </Td>
                                    <Td maxW={isMobile ? 5 : 100}> 20/11/2024 </Td>
                                    <Td p={0}>
                                        <Flex align="center" justify="center" height="100%">
                                            <DownloadIcon fontSize={20} />
                                        </Flex>
                                    </Td>
                                </Tr>
                                <Tr cursor="pointer" _hover={{ bg: "gray.100" }} >
                                    <Td maxW={isMobile ? 5 : 100} color="blue"> #3342 </Td>
                                    <Td maxW={isMobile ? 5 : 100}> jvcl@ic.ufal.br </Td>
                                    <Td maxW={isMobile ? 5 : 100}> 20/11/2024 </Td>
                                    <Td p={0}>
                                        <Flex align="center" justify="center" height="100%">
                                            <DownloadIcon fontSize={20} />
                                        </Flex>
                                    </Td>
                                </Tr>

                            </Tbody>
                        </Table>
                    </Box>
                </Box>
                <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
            </Flex>

            {isOpen && (
                <ModalReport
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}

        </>
    )
}

export default ReportsAud
