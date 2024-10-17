import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Box, Button, Divider, Flex, Heading, Icon, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react'
import api from '../../services/api';
import Title from '../../components/Title';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Pagination from '../../components/Pagination';

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
    }, [currentPage]);

    return (
        <>
            <Header></Header>

            <Title title="Logs do Sistema" subtitle="Registro detalhado de atividades e eventos do sistema" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >


                <Box maxW={800} w="100%" py={10} >
                    <Input
                        mt={4}
                        placeholder="Buscar Logs"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box overflowX="auto" height="100%">
                        <Table mt="6" overflowX="auto">
                            <Thead>
                                <Tr>
                                    <Th fontSize="16px">Data de Registro</Th>
                                    <Th fontSize="16px">Endereço IP</Th>
                                    <Th fontSize="16px">E-mail</Th>
                                    <Th fontSize="16px">Usuário</Th>
                                    <Th fontSize="16px">Método</Th>
                                    <Th fontSize="16px">Nível</Th>
                                    <Th fontSize="16px">Tipo</Th>
                                    <Th fontSize="16px">URL</Th>
                                    <Th fontSize="16px">Tabela</Th>
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
                                            <Td > {convertDate(log.created_at)} </Td>
                                            <Td > {log.ip} </Td>
                                            <Td > {log.email} </Td>
                                            <Td > {log.object_id} </Td>
                                            <Td > {log.method} </Td>
                                            <Td > {log.nivel} </Td>
                                            <Td > {log.type} </Td>
                                            <Td > {log.url} </Td>
                                            <Td > {log.table} </Td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

               <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage}/>
            </Flex>
        </>
    )
}

export default Logs