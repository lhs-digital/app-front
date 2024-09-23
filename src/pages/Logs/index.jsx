import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Box, Button, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react'
import api from '../../services/api';

const Logs = () => {
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [lastPage, setLastPage] = useState(null);

    // Função para converter a data
    const convertDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('pt-BR');
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await (api.get(`/logs?page=${currentPage}`));
                setCurrentPage(response.data.meta.current_page);
                setLastPage(response.data.meta.last_page);
                setData(response.data.data);
            } catch (error) {
                console.error('Erro ao verificar lista de Logs', error);
            }
        };
        getData();
    }, [data, currentPage, lastPage]);

    return (
        <>
            <Header></Header>
            <Heading textAlign='center' mt='12px'>Logs</Heading>
            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >


                <Box maxW={1400} w="100%" py={10} px={2}>
                    <Input
                        mt={4}
                        placeholder="Buscar Logs"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box overflowY="auto" height="100%">
                        <Table mt="6" overflowX="auto">
                            <Thead>
                                <Tr>
                                    <Th fontSize="16px">Endereço IP</Th>
                                    <Th fontSize="16px">E-mail</Th>
                                    <Th fontSize="16px">Nível</Th>
                                    <Th fontSize="16px">Tipo</Th>
                                    <Th fontSize="16px">Método</Th>
                                    <Th fontSize="16px">URL</Th>
                                    <Th fontSize="16px">Tabela</Th>
                                    <Th fontSize="16px">Usuário</Th>
                                    <Th fontSize="16px">Data de Criação</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    (!search ? data : data.filter(log =>
                                        log?.ip?.includes(search) ||
                                        log?.email?.includes(search) ||
                                        log?.nivel?.includes(search) ||
                                        log?.type?.includes(search) ||
                                        log?.method?.includes(search) ||
                                        log?.url?.includes(search) ||
                                        log?.table?.includes(search) ||
                                        log?.object_id?.includes(search) ||
                                        log?.created_at?.includes(search)
                                    )).map((log, index) => (
                                        <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }}>
                                            <Td > {log.ip} </Td>
                                            <Td > {log.email} </Td>
                                            <Td > {log.nivel} </Td>
                                            <Td > {log.type} </Td>
                                            <Td > {log.method} </Td>
                                            <Td > {log.url} </Td>
                                            <Td > {log.table} </Td>
                                            <Td > {log.object_id} </Td>
                                            <Td > {convertDate(log.created_at)} </Td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

                <Box maxW={800} py={5} px={2}>
                    {Array.from({ length: lastPage }, (_, i) => (
                        <Button
                            ml="6px"
                            color={currentPage === i + 1 ? 'white' : 'black'}
                            backgroundColor={currentPage === i + 1 ? 'blue.500' : 'gray.200'}
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </Box>
            </Flex>
        </>
    )
}

export default Logs