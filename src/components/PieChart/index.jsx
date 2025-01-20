import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Box, Text, Flex, Select, FormLabel } from '@chakra-ui/react';
import api from '../../services/api'; // Certifique-se de que o arquivo correto esteja importado

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [chartsData, setChartsData] = useState([]);
    const [selectedTable, setSelectedTable] = useState("clientes");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/auditing/summary');
                const fetchedData = response.data;

                const tableData = fetchedData.data.tables.find((table) => table.label === selectedTable);

                if (!tableData) {
                    setChartsData([]);
                    setLoading(false);
                    return;
                }

                const sortedColumns = [...tableData.columns].sort((a, b) => b.errors_count - a.errors_count);

                const newChartsData = sortedColumns.map((column) => {
                    const total = column.errors_count + column.fixed_errors_count;
                    const percentageErrors = total > 0 ? ((column.errors_count / total) * 100).toFixed(2) : 0;
                    const percentageFixed = total > 0 ? ((column.fixed_errors_count / total) * 100).toFixed(2) : 0;

                    return {
                        labels: ['Erros Pendentes', 'Erros Corrigidos'],
                        datasets: [
                            {
                                label: column.label,
                                data: [column.errors_count, column.fixed_errors_count],
                                backgroundColor: ['#FF6384', '#36A2EB'],
                                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
                            },
                        ],
                        percentages: [percentageErrors, percentageFixed],
                        counts: [column.errors_count, column.fixed_errors_count],
                    };
                });

                setChartsData(newChartsData);
            } catch (error) {
                console.error('Erro ao tentar consumir os dados dos gráficos', error);
                setChartsData([]);
            } finally {
                setLoading(false);
            }
        };

        processData();
    }, [selectedTable]);

    if (loading) return <Text>Carregando...</Text>;

    return (
        <Box display="flex" position="relative" flexDirection="column">
            <Box>
                <FormLabel fontSize="lg">Selecione a Tabela:</FormLabel>
                <Select size="lg" onChange={(e) => setSelectedTable(e.target.value)}>
                    <option value="clientes">Clientes</option>
                </Select>
            </Box>

            <Box
                display="flex"
                paddingBottom="42px"
                overflowX="auto"
                overflowY="hidden"
                alignItems="center"
            >
                {chartsData.map((data, index) => (
                    <Box key={index} width="240px" margin="20px">
                        <Flex direction="column" alignItems="center">
                            <Text fontSize="lg" fontWeight="bold" mb="2">
                                Coluna: {data.datasets[0].label}
                            </Text>
                            <Pie data={data} />
                            <Text fontWeight="bold" fontSize="md" color="gray.500">
                                Qtd. Pendentes: {data.counts[0]} ({data.percentages[0]}%)
                            </Text>
                            <Text fontWeight="bold" fontSize="md" color="gray.500">
                                Qtd. Corrigidos: {data.counts[1]} ({data.percentages[1]}%)
                            </Text>
                        </Flex>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PieChart;
