import { Box, Button, ButtonGroup, Divider, Flex, FormControl, FormLabel, Grid, Heading, Input, List, Select, Text, Tooltip, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ActivitieItem from '../ActivitieItem/ActivitieItem';
import api from '../../services/api';
import PieChart from '../PieChart';
import Pagination from '../Pagination';
import { formattedPriority, getPriorityColor } from '../../services/utils';
import { Link } from 'react-router-dom';

const ListActivities = () => {
    const [dataPriorityOne, setDataPriorityOne] = useState([]);
    const [dataPriorityTwo, setDataPriorityTwo] = useState([]);
    const [dataPriorityThree, setDataPriorityThree] = useState([]);
    const [loading, setLoading] = useState(true); // Adicionado estado de carregamento
    const [refresh, setRefresh] = useState(false);
    const [status, setStatus] = useState(null);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Ativar o carregamento
            try {
                const responsePriorityOne = await (api.get(`/auditing?per_page=${50}`,
                    {
                        params: {
                            priority: 1,
                        }
                    }
                ));

                setDataPriorityOne(responsePriorityOne.data.data);

                const responsePriorityTwo = await (api.get(`/auditing?per_page=${50}`,
                    {
                        params: {
                            priority: 2,
                        }
                    }
                ));

                setDataPriorityTwo(responsePriorityTwo.data.data);

                const responsePriorityThree = await (api.get(`/auditing?per_page=${50}`,
                    {
                        params: {
                            priority: 3,
                        }
                    }
                ));

                setDataPriorityThree(responsePriorityThree.data.data);
            } catch (error) {
                console.error('Erro ao verificar lista de usuários', error);
            } finally {
                setLoading(false)
            }
        };
        getData();
    }, [refresh, status]);

    return (
        <>
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

                    <Heading >Gráficos das Atividades</Heading>
                    <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                    <Heading fontSize="lg" fontWeight="regular" color="gray.500">Visualize e acompanhe o status e progresso das atividades em geral</Heading>

                    <PieChart
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />
                </Box>

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

                    {/* <Box>
                        <FormLabel fontSize="lg">Selecione a Tabela:</FormLabel>
                        <Select size="lg">
                            <option>clients</option>
                        </Select>
                    </Box> */}

                    <Box overflowX={isMobile ? "auto" : "hidden"}>

                        <Grid
                            templateColumns="repeat(3, 1fr)"
                            gap={3}
                            marginBottom="24px"
                            width={isMobile ? "800px" : "100%"}
                            height="740px"
                            overflowY={isMobile ? "auto" : "hidden"}


                        >
                            <List spacing={3} bg={getPriorityColor(3).bgColor} rounded="6px" padding="6px">
                                <Box
                                    display="flex"
                                    flexDirection={isMobile ? "column" : "flex"}
                                    justifyContent="center"
                                    alignItems="center"
                                    width={isMobile ? "100%" : "auto"}
                                    marginBottom="10px"
                                    gap="6px"
                                >
                                    <Tooltip label={`Prioridade: ${formattedPriority(3)}`} aria-label="Prioridade">
                                        <Text
                                            fontSize={isMobile ? "sm" : "md"}
                                            color={getPriorityColor(3).textColor}
                                            bg={getPriorityColor(3).bgColor}
                                            textAlign="center"
                                            p={1}
                                            width="100%"
                                            rounded="6px"
                                            title={`Prioridade: ${formattedPriority(3)}`}
                                        >Prioridade: <b>{formattedPriority(3)}</b></Text>
                                    </Tooltip>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="6px"
                                    overflowY="auto"
                                    height="668px"
                                    paddingRight="6px"
                                    marginBottom="112px"
                                >

                                    {
                                        dataPriorityThree.map((item) => (
                                            (
                                                (
                                                    <ActivitieItem
                                                        key={item.id}
                                                        activitie={item}
                                                        setRefresh={setRefresh}
                                                        refresh={refresh}
                                                    />
                                                )
                                            )
                                        ))
                                    }
                                </Box>
                            </List>
                            <List spacing={3} bg={getPriorityColor(2).bgColor} rounded="6px" padding="6px">
                                <Box
                                    display="flex"
                                    flexDirection={isMobile ? "column" : "flex"}
                                    justifyContent="center"
                                    alignItems="center"
                                    width={isMobile ? "100%" : "auto"}
                                    marginBottom="10px"
                                    gap="6px"
                                >
                                    <Tooltip label={`Prioridade: ${formattedPriority(2)}`} aria-label="Prioridade">
                                        <Text
                                            fontSize={isMobile ? "sm" : "md"}
                                            color={getPriorityColor(2).textColor}
                                            bg={getPriorityColor(2).bgColor}
                                            textAlign="center"
                                            p={1}
                                            width="100%"
                                            rounded="6px"
                                            title={`Prioridade: ${formattedPriority(2)}`}
                                        >Prioridade: <b>{formattedPriority(2)}</b></Text>
                                    </Tooltip>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="6px"
                                    overflowY="auto"
                                    height="668px"
                                    paddingRight="6px"
                                >
                                    {
                                        dataPriorityTwo.length > 0 ?
                                            dataPriorityTwo.map((item) => (
                                                (
                                                    (
                                                        <ActivitieItem
                                                            key={item.id}
                                                            activitie={item}
                                                            setRefresh={setRefresh}
                                                            refresh={refresh}
                                                        />
                                                    )
                                                )
                                            )) : <Text fontSize="md" fontStyle="italic" textAlign="center" color="gray.500">Não há nenhuma atividade no momento.</Text>
                                    }
                                </Box>
                            </List>
                            <List spacing={3} bg={getPriorityColor(1).bgColor} rounded="6px" padding="6px">
                                <Box
                                    display="flex"
                                    flexDirection={isMobile ? "column" : "flex"}
                                    justifyContent="center"
                                    alignItems="center"
                                    width={isMobile ? "100%" : "auto"}
                                    marginBottom="10px"
                                    gap="6px"
                                >
                                    <Tooltip label={`Prioridade: ${formattedPriority(1)}`} aria-label="Prioridade">
                                        <Text
                                            fontSize={isMobile ? "sm" : "md"}
                                            color={getPriorityColor(1).textColor}
                                            bg={getPriorityColor(1).bgColor}
                                            textAlign="center"
                                            p={1}
                                            width="100%"
                                            rounded="6px"
                                            title={`Prioridade: ${formattedPriority(1)}`}
                                        >Prioridade: <b>{formattedPriority(1)}</b></Text>
                                    </Tooltip>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="6px"
                                    overflowY="auto"
                                    height="668px"
                                    paddingRight="6px"
                                >
                                    {
                                        dataPriorityOne.map((item) => (
                                            (
                                                (

                                                    <ActivitieItem
                                                        key={item.id}
                                                        activitie={item}
                                                        setRefresh={setRefresh}
                                                        refresh={refresh}
                                                    />
                                                )
                                            )
                                        ))
                                    }
                                </Box>
                            </List>
                        </Grid>
                    </Box>

                </Box>
            </Box>
        </>
    )
}

export default ListActivities