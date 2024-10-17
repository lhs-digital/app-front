import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { Box, Text, Flex, Select, FormLabel, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ refresh }) => {
    const [chartsData, setChartsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scrollShadow, setScrollShadow] = useState('none');

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/auditing/summary`);
                const fetchedData = response.data;

                const newChartsData = fetchedData.map(item => {
                    const total = item.status_0 + item.status_1;
                    const percentage0 = ((item.status_0 / total) * 100).toFixed(3);
                    const percentage1 = ((item.status_1 / total) * 100).toFixed(3);
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

    const handleScroll = (event) => {
        const element = event.target;
        const maxScrollLeft = element.scrollWidth - element.clientWidth;

        if (element.scrollLeft > 0 && element.scrollLeft < maxScrollLeft) {
            setScrollShadow('inset 10px 0 8px -8px rgba(0, 0, 0, 0.2), inset -10px 0 8px -8px rgba(0, 0, 0, 0.2)');
        } else if (element.scrollLeft === 0) {
            setScrollShadow('inset -10px 0 8px -8px rgba(0, 0, 0, 0.2)');
        } else if (element.scrollLeft >= maxScrollLeft) {
            setScrollShadow('inset 10px 0 8px -8px rgba(0, 0, 0, 0.2)');
        }
    };

    if (loading) return <Text>Carregando...</Text>;

    return (
        <Box display="flex" position="relative" flexDirection="column">
            <Box>
                <FormLabel fontSize="lg">Selecione a Tabela:</FormLabel>
                <Select size="lg">
                    <option>clients</option>
                </Select>
            </Box>

            <Box
                display="flex"
                paddingBottom="42px"
                overflowX="auto"
                overflowY="hidden"
                boxShadow={scrollShadow}
                onScroll={handleScroll}
            >
                {/* Seta indicativa de scroll */}
                {chartsData.map((data, index) => (
                    <Box key={index} width="240px" margin="20px"> {/* Ajuste a largura aqui */}
                        <Flex direction="column" alignItems="center">
                            <Text fontSize="lg" fontWeight="bold" mb="2">Coluna: {data.datasets[0].label}</Text>
                            <Pie data={data} />
                            <Text fontWeight="bold" fontSize="md" color="gray.500">Qtd. Pendentes: {data.counts[0]} ({data.percentages[0]}%)</Text>
                            <Text fontWeight="bold" fontSize="md" color="gray.500">Qtd. Concluídas: {data.counts[1]} ({data.percentages[1]}%)</Text>
                        </Flex>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PieChart;
