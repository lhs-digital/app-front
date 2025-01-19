import React from 'react';
import {
    Button,
    Box,
    Tooltip,
    Text,
    Divider,
    useBreakpointValue,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
} from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { formattedPriority, getPriorityColor } from '../../services/utils';

const ViewActivitie = ({ id, status, selectedActivitie, setRefresh, refresh, onClose }) => {
    const formattedDate = (date) => new Date(date).toLocaleDateString('pt-BR');
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const handleConfirm = async () => {
        try {
            await api.put(`/auditing/${id}/toggle_status`);
            toast.success('Status da atividade alterado com sucesso!');
        } catch (error) {
            console.error('Erro ao alterar o status da atividade', error);
        } finally {
            setRefresh(!refresh)
        }
    };

    return (
        <Box width="100%" maxWidth="800px" gap="12px" flexDirection="column" display="flex">
            <Table variant="striped" size="sm" width="100%" borderColor="gray.200" borderRadius="md">
                <Thead bg="gray.100">
                    <Tr>
                        <Th>Campo</Th>
                        <Th>Sugestão</Th>
                        <Th>Prioridade</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {selectedActivitie?.columns.map((col, index) => (
                        <Tr key={index}>
                            <Td fontWeight="bold">{col?.column}</Td>
                            <Td>{col?.message}</Td>
                            <Td>
                                <Tooltip label={`Prioridade: ${formattedPriority(+col?.priority)}`} aria-label="Prioridade">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color={getPriorityColor(+col?.priority).textColor}
                                        bg={getPriorityColor(+col?.priority).bgColor}
                                        p={1}
                                        rounded="md"
                                        textAlign="center"
                                    >
                                        {formattedPriority(+col?.priority)}
                                    </Text>
                                </Tooltip>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {/* <Box ><b>Auditoria foi realizada em:</b> {formattedDate(selectedActivitie?.created_at)} </Box>
            <Box ><b>Auditoria foi atualizada em:</b> {formattedDate(selectedActivitie?.updated_at)} </Box> */}
            <Box marginTop={4} display="flex" justifyContent="flex-end">
                <Button colorScheme={status === 1 ? "orange" : "green"} onClick={handleConfirm}>
                    {status === 1 ? "Marcar como Pendente" : "Concluir Atividade"}
                </Button>
            </Box>
        </Box>
    );
};

export default ViewActivitie;
