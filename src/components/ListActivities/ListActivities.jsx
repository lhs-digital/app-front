import { Box, Button, ButtonGroup, Heading, Icon, Input, List, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ActivitieItem from '../ActivitieItem/ActivitieItem';
import api from '../../services/api';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const ListActivities = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [refresh, setRefresh] = useState(false);
    

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Ativar o carregamento
            try {
                const response = await (api.get(`/auditing?page=${currentPage}`));
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
    }, [currentPage, refresh]);

    const handleClean = () => {
        setSearch('');
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
                paddingX="24px"
            >
                <Heading>Lista de Atividades</Heading>
                <Input
                    mt="0px"
                    placeholder="Buscar atividade"
                    size="lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Box textAlign="right">
                    <ButtonGroup>
                        <Button onClick={handleClean}>Limpar Filtro</Button>
                        <Button colorScheme="blue">Filtrar</Button>
                    </ButtonGroup>
                </Box>
                <Tabs variant="unstyled" colorScheme="blue">
                    <TabList>
                        <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg">Pendentes</Tab>
                        <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg">Concluídas</Tab>
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
                                                activitie={item}                    setRefresh={setRefresh}
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