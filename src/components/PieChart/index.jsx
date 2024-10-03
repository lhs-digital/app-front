import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { Box, Text, Flex, VStack, Grid } from '@chakra-ui/react';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({refresh}) => {
    const [chartsData, setChartsData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/auditing/summary`);
                const fetchedData = response.data;

                const newChartsData = fetchedData.map(item => {
                    const total = item.status_0 + item.status_1;
                    const percentage0 = ((item.status_0 / total) * 100).toFixed(2);
                    const percentage1 = ((item.status_1 / total) * 100).toFixed(2);
                    return {
                        labels: ['Pendentes', 'Concluídas'],
                        datasets: [
                            {
                                label: item.column,
                                data: [item.status_0, item.status_1],
                                backgroundColor: ['#FFCE56', '#36A2EB'],
                                hoverBackgroundColor: ['#FFCE56', '#36A2EB'],
                            },
                        ],
                        percentages: [percentage0, percentage1],
                        counts: [item.status_0, item.status_1],
                    };
                });

                setChartsData(newChartsData);
            } catch (error) {
                console.error('Erro ao verificar lista de usuários', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [refresh]);

    if (loading) return <Text>Carregando...</Text>;

    return (
        <Box display="flex" paddingBottom="42px" overflowX="auto" overflowY="hidden">
            {chartsData.map((data, index) => (
                <Box key={index} width="240px" height="240px" margin="20px"> {/* Ajuste a largura aqui */}
                    <Flex direction="column" alignItems="center">
                        <Text fontSize="lg" fontWeight="bold" mb="2">Coluna: {data.datasets[0].label}</Text>
                        <Pie data={data} />
                    </Flex>
                </Box>
            ))}
        </Box>
    );
};

export default PieChart;
