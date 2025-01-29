import { Box, Button, ButtonGroup, Divider, Flex, FormControl, FormLabel, Grid, Heading, Input, List, Select, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ActivitieItem from '../../components/ActivitieItem/ActivitieItem';
import api from '../../services/api';
import Pagination from '../../components/Pagination';
import Header from '../../components/Header';

const AllActivities = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [table, setTable] = useState('');
    const [priorityOrder, setPriorityOrder] = useState("desc");
    const [status, setStatus] = useState(null);
    const [createdAt, setCreatedAt] = useState([]);
    const [per_page, setPer_page] = useState(20);
    const [priority, setPriority] = useState(null);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    const [filterParams, setFilterParams] = useState({
        search: '',
        priorityOrder: 'desc',
        createdAt: [],
        status: null,
        priority: null
    });

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await (api.get(`/auditing?page=${currentPage}&per_page=${per_page}`,
                    {
                        params: {
                            search: filterParams?.search,
                            priority_order: filterParams?.priorityOrder,
                            ...(status !== null && { status: status }),
                            priority: filterParams?.priority,
                            created_at: [filterParams?.createdAt[0], filterParams?.createdAt[1]],
                        }
                    }
                ));

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
    }, [currentPage, refresh, filterParams, per_page, status]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setFilterParams((prev) => ({
            ...prev,
            status: newStatus,
        }));
    };

    const handlePriorityOrder = (event) => {
        const newOrder = event.target.value;
        setPriorityOrder(newOrder);
        setFilterParams({
            search: '',
            status: null,
            priorityOrder: newOrder,
            priority: null,
            createdAt: [],
        });
    }

    const handleClean = () => {
        setSearch('');
        setTable('');
        setPriorityOrder('desc');
        setCreatedAt([null, null]);
        setFilterParams({
            search: '',
            priorityOrder: 'desc',
            status: null,
            priority: null,
            createdAt: [],
        });
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    const handleFilter = () => {
        setFilterParams({
            search,
            priorityOrder,
            priority,
            status: null,
            createdAt,
        });

        setCurrentPage(1);
        setRefresh(!refresh);
    }

    const handlePerPageChange = (e) => {
        setPer_page(e.target.value);
    }

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
                <Box
                    width="100%"
                    maxWidth="800px"
                    gap="64px"
                    flexDirection="column"
                    display="flex"
                >
                    <Box
                        width="100%"
                        maxWidth="800px"
                        gap="12px"
                        flexDirection="column"
                        display="flex"
                    >


                        <Heading >Lista de Atividades</Heading>
                        <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                        <Heading fontSize="lg" fontWeight="regular" color="gray.500">
                            Gerencie todas as suas atividades pendentes e concluídas
                        </Heading>

                        <FormControl
                            display="flex" flexDirection="column" gap={4} marginBottom="24px"
                        >
                            <Grid
                                templateColumns={isMobile ? "1fr" : "1fr 3fr"}
                                gap={4}
                                alignItems="center"
                            >

                                <Box>
                                    <FormLabel fontSize="lg">Selecione a Tabela:</FormLabel>
                                    <Select size="lg">
                                        <option>clients</option>
                                    </Select>
                                </Box>
                                <Box>
                                    <FormLabel fontSize="lg">Pesquise por:</FormLabel>
                                    <Input
                                        mt="0px"
                                        placeholder="ID do cliente, Campo inválido, Valor do campo inválido e Mensagem de erro"
                                        size="lg"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Box>
                            </Grid>

                            <Grid
                                templateColumns="1fr"
                                gap={4}
                            >
                                <Box>
                                    <FormLabel fontSize="lg">Data da Auditoria</FormLabel>
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
                                </Box>
                            </Grid>

                            <Grid
                                templateColumns={isMobile ? "1fr" : "1fr 1fr 1fr"}
                                gap={4}
                            >

                                <Box>
                                    <FormLabel fontSize="lg">Selecione a Ordem de Prioridade:</FormLabel>
                                    <Select size="lg" value={priorityOrder} onChange={handlePriorityOrder}>
                                        <option value="desc">Decrescente</option>
                                        <option value="asc">Crescente</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel fontSize="lg">Selecione o Status:</FormLabel>
                                    <Select
                                        size="lg"
                                        value={status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value={null}>Todos</option>
                                        <option value={0}>Pendentes</option>
                                        <option value={1}>Concluídas</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel fontSize="lg">Selecione a Prioridade:</FormLabel>
                                    <Select
                                        size="lg"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value={null}>Todas</option>
                                        <option value={1}>Baixa</option>
                                        <option value={2}>Moderada</option>
                                        <option value={3}>Urgente</option>
                                    </Select>
                                </Box>
                            </Grid>

                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                flexDirection="row"
                            >
                                <Select
                                    value={per_page}
                                    width="150px"
                                    onChange={handlePerPageChange}
                                >
                                    <option value={10}>10 por página</option>
                                    <option value={20}>20 por página</option>
                                    <option value={30}>30 por página</option>
                                    <option value={50}>50 por página</option>
                                </Select>
                                <Box>
                                    <ButtonGroup>
                                        <Button onClick={handleClean}>Limpar Filtro</Button>
                                        <Button colorScheme="blue" onClick={handleFilter}>Filtrar</Button>
                                    </ButtonGroup>
                                </Box>
                            </Flex>
                        </FormControl>


                        <Flex alignItems="center" justifyContent="space-between">
                            <Flex alignItems="center" gap={3}>
                                <Flex alignItems="center">
                                    <Box width="12px" height="12px" bg="orange.500" borderRadius="30%" mr={2} />
                                    <Text fontSize="sm" color="gray.500">Pendentes</Text>
                                </Flex>
                                <Flex alignItems="center">
                                    <Box width="12px" height="12px" bg="green.500" borderRadius="30%" mr={2} />
                                    <Text fontSize="sm" color="gray.500">Concluídas</Text>
                                </Flex>
                            </Flex>

                        </Flex>

                        <List spacing={3}>
                            {data?.length === 0 ? (
                                <Text textAlign="center" color="gray.500" fontSize="md">Não existem tasks concluídas</Text>
                            ) : (
                                data.map((item) => (
                                    <ActivitieItem
                                        key={item.id}
                                        activitie={item}
                                        setRefresh={setRefresh}
                                        refresh={refresh}
                                    />
                                ))
                            )}
                        </List>
                        <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
                    </Box>
                </Box >
            </Flex >

        </>
    )
}

export default AllActivities