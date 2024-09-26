import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Grid, Heading, Icon, Input, List, Select, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ActivitieItem from '../ActivitieItem/ActivitieItem';
import api from '../../services/api';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { InputLabel } from '@mui/material';

const ListActivities = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [table, setTable] = useState('');
    const [priorityOrder, setPriorityOrder] = useState("asc");
    const [status, setStatus] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    // Guardar os parâmetros de filtro
    const [filterParams, setFilterParams] = useState({
        search: '',
        priorityOrder: 'asc',
        createdAt: '',
        updatedAt: ''
    });


    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Ativar o carregamento
            try {
                const response = await (api.get(`/auditing?page=${currentPage}`,
                    {
                        params: {
                            search: filterParams.search,
                            priority_order: filterParams.priorityOrder,
                            created_at: filterParams.createdAt,
                            updated_at: filterParams.updatedAt
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
    }, [currentPage, refresh, filterParams]);

    const handlePriorityOrder = () => {
        setPriorityOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
    }

    const handleClean = () => {
        setSearch('');
        setTable('');
        setPriorityOrder('asc');
        setCreatedAt('');
        setUpdatedAt('');
        setFilterParams({
            search: '',
            priorityOrder: 'asc',
            createdAt: '',
            updatedAt: ''
        });
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    const handleFilter = () => {
        if (!table && !search) {
            return;
        }
        // Atualiza o estado com os parâmetros atuais de filtro
        setFilterParams({
            search,
            priorityOrder,
            createdAt,
            updatedAt
        });
        // Reinicia para a primeira página ao aplicar um filtro
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    // Função para renderizar os botões de paginação dinamicamente
    const renderPagination = () => {
        const startPage = Math.max(2, currentPage - 2); // Definir o início das páginas
        const endPage = Math.min(lastPage - 1, currentPage + 2); // Definir o fim das páginas

        const buttons = [];

        // Primeira página
        buttons.push(
            <Button
                ml="6px"
                color={currentPage === 1 ? 'white' : 'black'}
                backgroundColor={currentPage === 1 ? 'blue.500' : 'gray.200'}
                onClick={() => setCurrentPage(1)}
                key={1}
            >
                {1}
            </Button>
        );

        // Reticências se houver um intervalo grande
        if (startPage > 2) {
            buttons.push(<Text ml="6px" key="ellipsis-start">...</Text>);
        }

        // Páginas intermediárias
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    ml="6px"
                    color={currentPage === i ? 'white' : 'black'}
                    backgroundColor={currentPage === i ? 'blue.500' : 'gray.200'}
                    onClick={() => setCurrentPage(i)}
                    key={i}
                >
                    {i}
                </Button>
            );
        }

        // Reticências se houver um intervalo grande antes da última página
        if (endPage < lastPage - 1) {
            buttons.push(<Text ml="6px" key="ellipsis-end">...</Text>);
        }

        // Última página
        if (lastPage > 1) {
            buttons.push(
                <Button
                    ml="6px"
                    color={currentPage === lastPage ? 'white' : 'black'}
                    backgroundColor={currentPage === lastPage ? 'blue.500' : 'gray.200'}
                    onClick={() => setCurrentPage(lastPage)}
                    key={lastPage}
                >
                    {lastPage}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <>
            <Box
                width="100%"
                maxWidth="800px"
                gap="12px"
                flexDirection="column"
                display="flex"
            >
                <Heading>Lista de Atividades</Heading>
                <FormControl
                    display="flex" flexDirection="column" gap={4}
                >
                    <Input
                        mt="0px"
                        placeholder="Busque por: primary_key_value, column, value e message"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Grid
                        templateColumns="1fr 1fr"
                        gap={4}
                    >
                        <Box>
                            <FormLabel fontSize="lg">Data de Criação</FormLabel>
                            <Input
                                size="lg"
                                placeholder='Data de Criação'
                                type='date'
                                value={createdAt}
                                onChange={(e) => setCreatedAt(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <FormLabel fontSize="lg">Data de Atualização</FormLabel>
                            <Input
                                size="lg"
                                placeholder='Data de Atualização'
                                type='date'
                                value={updatedAt}
                                onChange={(e) => setUpdatedAt(e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                    >
                        <Button onClick={handlePriorityOrder}>
                            {
                                priorityOrder ?
                                    (
                                        <Tooltip label="Ordem Crescente de Prioridade" aria-label="Ordem Crescente">
                                            <Icon as={KeyboardDoubleArrowUpIcon}></Icon>
                                        </Tooltip>
                                    ) :
                                    (
                                        <Tooltip label="Ordem Decrescente de Prioridade" aria-label="Ordem Decrescente">
                                            <Icon as={KeyboardDoubleArrowUpIcon} transform="rotate(180deg)"></Icon>
                                        </Tooltip>
                                    )
                            }
                        </Button>

                        <Box textAlign="right">
                            <ButtonGroup>
                                <Button onClick={handleClean}>Limpar Filtro</Button>
                                <Button colorScheme="blue" onClick={handleFilter}>Filtrar</Button>
                            </ButtonGroup>
                        </Box>
                    </Flex>
                </FormControl>
                <Tabs variant="unstyled" colorScheme="blue">
                    <TabList>
                        <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg"
                            onClick={() => setStatus(false)}
                        >Pendentes</Tab>
                        <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg"
                            onClick={() => setStatus(true)}
                        >Concluídas</Tab>
                    </TabList>
                    <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />

                    <TabPanels>
                        <TabPanel paddingX={0}>
                            <List spacing={3}>
                                {
                                    data.map((item) => (
                                        item.status === false ? (
                                            <ActivitieItem
                                                key={item.id}
                                                activitie={item} setRefresh={setRefresh}
                                                refresh={refresh}
                                            />
                                        ) : null
                                    ))
                                }
                            </List>
                        </TabPanel>
                        <TabPanel paddingX={0}>
                            <List spacing={3}>
                                {
                                    data.map((item) => (
                                        item.status === true ? (
                                            <ActivitieItem
                                                key={item.id}
                                                activitie={item}
                                                setRefresh={setRefresh}
                                                refresh={refresh}
                                            />
                                        ) : null
                                    ))
                                }
                            </List>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                {/* Renderizando a paginação */}
                <Box maxW={800} py={5} px={2} mb={24} display="flex" justifyContent="center">
                    {/* Botão anterior */}
                    <Button
                        ml="6px"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        isDisabled={currentPage === 1}
                    >
                        <Icon as={SkipPreviousIcon} />
                    </Button>

                    {/* Renderização dinâmica dos botões de página */}
                    {renderPagination()}

                    {/* Botão próximo */}
                    <Button
                        ml="6px"
                        onClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))}
                        isDisabled={currentPage === lastPage}
                    >
                        <Icon as={SkipNextIcon} />
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default ListActivities