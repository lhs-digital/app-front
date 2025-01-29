import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Box, Button, ButtonGroup, Divider, Flex, FormLabel, Grid, Heading, Icon, Input, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react'
import api from '../../services/api';
import Title from '../../components/Title';
import Pagination from '../../components/Pagination';
import { dateFormatted } from '../../services/utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const Logs = () => {
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [lastPage, setLastPage] = useState(null);
    const [createdAt, setCreatedAt] = useState([]);
    const [loading, setLoading] = useState(false);
    const [table, setTable] = useState('');
    const [method, setMethod] = useState("");
    const [nivel, setNivel] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });

    const [filterParams, setFilterParams] = useState({
        search: '',
        method: '',
        createdAt: [],
        nivel: ""
    });


    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const params = {
                    search: filterParams?.search || undefined,
                    method: filterParams?.method || undefined,
                    nivel: filterParams?.nivel || undefined,
                    created_at: filterParams?.createdAt && filterParams?.createdAt.length > 0 ? [filterParams.createdAt[0], filterParams.createdAt[1]] : undefined
                };

                const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

                const response = await api.get(`/logs?page=${currentPage}`, {
                    params: filteredParams
                });

                setCurrentPage(response.data.meta.current_page);
                setLastPage(response.data.meta.last_page);
                setData(response.data.data);
            } catch (error) {
                console.error('Erro ao verificar lista de usuários', error);
            } finally {
                setLoading(false)
            }
        };
        getData();
    }, [currentPage, refresh, filterParams]);

    const handleClean = () => {
        setSearch('');
        setTable('');
        setCreatedAt([null, null]);
        setFilterParams({
            search: '',
            method: '',
            nivel: '',
            createdAt: [],
        });
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    const handleFilter = () => {
        setFilterParams({
            search,
            method,
            nivel,
            createdAt,
        });

        setCurrentPage(1);
        setRefresh(!refresh);
    }

    const handleSort = (key) => {
        const direction = sortConfig.direction === 'asc' && sortConfig.key === key ? 'desc' : 'asc';

        const sortedData = [...data].sort((a, b) => {
            const aKey = key.split('.').reduce((acc, part) => acc && acc[part], a);
            const bKey = key.split('.').reduce((acc, part) => acc && acc[part], b);

            if (aKey < bKey) return direction === 'asc' ? -1 : 1;
            if (aKey > bKey) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setData(sortedData);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null; 
        return sortConfig.direction === 'asc' ? <ChevronUpIcon ml={2} /> : <ChevronDownIcon ml={2} />;
    };

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
                    <Grid
                        templateColumns={isMobile ? "1fr" : "1fr 1fr 1fr"}
                        gap={4}
                        alignItems="center"
                    >

                        <Box mb={2}>
                            <FormLabel fontSize="lg">Selecione a Tabela:</FormLabel>
                            <Select size="lg">
                                <option>clients</option>
                            </Select>
                        </Box>
                        <Box mb={2}>
                            <FormLabel fontSize="lg">Selecione a Operação:</FormLabel>
                            <Select
                                size="lg"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="POST">POST</option>
                                <option value="GET">GET</option>
                            </Select>
                        </Box>
                        <Box mb={2}>
                            <FormLabel fontSize="lg">Selecione o Nível:</FormLabel>
                            <Select
                                value={nivel}
                                onChange={(e) => setNivel(e.target.value)}
                                size="lg"
                            >
                                <option value="">Todos</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </Select>
                        </Box>
                    </Grid>
                    <Box mb={2}>
                        <FormLabel fontSize="lg">Pesquise por:</FormLabel>
                        <Input
                            mt="0px"
                            placeholder="IP, tipo e URL"
                            size="lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Box>

                    <Grid
                        templateColumns="1fr"
                        gap={4}
                    >
                        <Box>
                            <FormLabel fontSize="lg">Período</FormLabel>
                            <Flex alignItems="center" gap="6px">
                                <Input
                                    size="lg"
                                    placeholder='Data de Auditoria'
                                    type='date'
                                    value={createdAt[0] || ""}
                                    onChange={(e) => setCreatedAt([e.target.value, createdAt[1]])}
                                />
                                até
                                <Input
                                    size="lg"
                                    placeholder='Data de Auditoria'
                                    type='date'
                                    value={createdAt[1] || ""}
                                    onChange={(e) => setCreatedAt([createdAt[0], e.target.value])}
                                />
                            </Flex>
                            <Flex
                                justifyContent="flex-end"
                                alignItems="center"
                                flexDirection="row"
                                marginTop={4}
                            >
                                <Box>
                                    <ButtonGroup>
                                        <Button onClick={handleClean}>Limpar Filtro</Button>
                                        <Button colorScheme="blue" onClick={handleFilter}>Filtrar</Button>
                                    </ButtonGroup>
                                </Box>
                            </Flex>
                        </Box>
                    </Grid>
                    <Box overflowX="auto" height="100%">
                        <Table mt="6" overflowX="auto">
                            <Thead>
                                <Tr>
                                    <Th fontSize="16px" onClick={() => handleSort('created_at')} cursor="pointer">Data de Registro {getSortIcon('created_at')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.ip')} cursor="pointer">Endereço IP {getSortIcon('log.ip')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.email')} cursor="pointer">E-mail {getSortIcon('log.email')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.user')} cursor="pointer">Usuário {getSortIcon('log.user')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.method')} cursor="pointer">Operação {getSortIcon('log.method')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.nivel')} cursor="pointer">Nível {getSortIcon('log.nivel')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.type')} cursor="pointer">Tipo {getSortIcon('log.type')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.url')} cursor="pointer">URL {getSortIcon('log.url')}</Th>
                                    <Th fontSize="16px" onClick={() => handleSort('log.table')} cursor="pointer">Tabela {getSortIcon('log.table')}</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    data.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={4} textAlign="center">
                                                Não existem logs no sistema
                                            </Td>
                                        </Tr>
                                    ) : (
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
                                        <Tr key={index}
                                            cursor="pointer"
                                            _odd={{ bg: "gray.100" }}
                                            _even={{ bg: "white" }}
                                            _hover={{ bg: "gray.50" }}>
                                            <Td > {dateFormatted(log.created_at)} </Td>
                                            <Td > {log.ip} </Td>
                                            <Td > {log.email} </Td>
                                            <Td > {log.object_id} </Td>
                                            <Td > {log.method} </Td>
                                            <Td > {log.nivel} </Td>
                                            <Td > {log.type} </Td>
                                            <Td > {log.url} </Td>
                                            <Td > {log.table} </Td>
                                        </Tr>
                                    )))
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

                <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
            </Flex>
        </>
    )
}

export default Logs