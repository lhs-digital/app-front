import { Box, Button, Divider, Flex, Heading, List, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, useBreakpointValue } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import ActivitieItem from '../ActivitieItem/ActivitieItem';
import api from '../../services/api';
import PieChart from '../PieChart';
import { formattedPriority, getPriorityColor } from '../../services/utils';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

const ListActivities = () => {
    const [data, setData] = useState([]);
    const [dataPriorityOne, setDataPriorityOne] = useState([]);
    const [dataPriorityTwo, setDataPriorityTwo] = useState([]);
    const [dataPriorityThree, setDataPriorityThree] = useState([]);
    const [dataSelected, setDataSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState('3');
    const { user } = useContext(AuthContext);
    const role = user?.user?.role?.name;

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/auditing?per_page=${50}`, {
                    params: { status }
                });
                setData(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar atividades:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [priority, status, refresh]);

    return (
        <>
            <Box
                width="100%"
                maxWidth="800px"
                gap="64px"
                flexDirection="column"
                display="flex"
            >
                {role !== 'super-admin' && (
                    <Box
                        width="100%"
                        maxWidth="800px"
                        gap="12px"
                        flexDirection="column"
                        display="flex"
                    >

                        <Heading >Gráficos das Atividades</Heading>
                        <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                        <Heading fontSize="lg" fontWeight="regular" color="gray.500">Visualize e acompanhe o status e progresso das atividades em geral</Heading>


                        <PieChart
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                    </Box>
                )}

                <Box
                    width="100%"
                    maxWidth="800px"
                    gap="12px"
                    flexDirection="column"
                    display="flex"
                >

                    <Flex alignItems="flex-end" justifyContent="space-between" >

                        <Heading >Lista das Atividades</Heading>
                        <Link to="/atividades" >
                            <Button colorScheme='blue' variant='outline'>
                                Ver Todas as Atividades
                            </Button>
                        </Link>
                    </Flex>

                    <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                    <Heading fontSize="lg" fontWeight="regular" color="gray.500">
                        Gerencie as 50 primeiras atividades pendentes de cada prioridade abaixo
                    </Heading>

                    <Tabs variant="unstyled" colorScheme="blue" marginTop="24px">
                        <TabList display="flex" justifyContent="space-between">
                            <Box display="flex">
                                <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg"
                                    onClick={() => setStatus(0)}
                                >Pendentes</Tab>
                                <Tab _selected={{ color: 'blue.500' }} color="gray.400" fontSize="lg"
                                    onClick={() => setStatus(1)}
                                >Concluídas</Tab>
                            </Box>
                        </TabList>
                        <TabIndicator mb='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />

                        <TabPanels>
                            <TabPanel paddingX={0}>
                                <List spacing={3}>
                                    {data.map((item) => (
                                        <ActivitieItem
                                            key={item.id}
                                            activitie={item}
                                            setRefresh={setRefresh}
                                            refresh={refresh}
                                        />
                                    ))}
                                </List>
                            </TabPanel>
                            <TabPanel paddingX={0}>
                                <List spacing={3}>
                                    {data.map((item) => (
                                        <ActivitieItem
                                            key={item.id}
                                            activitie={item}
                                            setRefresh={setRefresh}
                                            refresh={refresh}
                                        />
                                    ))}
                                </List>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </>
    )
}

export default ListActivities