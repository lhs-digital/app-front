import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Box,
    Tooltip,
    Text,
    Divider,
    useBreakpointValue,
} from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { formattedPriority, getPriorityColor } from '../../services/utils';

const ViewActivitie = ({ id, status, selectedActivitie, setDataView, setRefresh, refresh, isOpen, onClose }) => {
    const formattedDate = (date) => new Date(date).toLocaleDateString('pt-BR');
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const handleConfirm = async () => {
        try {
            // Chamada para a API para alterar o status da atividade
            await api.put(`/auditing/${id}/toggle_status`);
            toast.success('Status da atividade alterado com sucesso!');
        } catch (error) {
            console.error('Erro ao alterar o status da atividade', error);
        } finally {
            setRefresh(!refresh)
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader paddingY="12px" margin={0} gap={0}>
                    Informações Gerais da Atividade
                    <Text fontSize="md" color="gray.500" mt="2" paddingY="2px" margin={0} gap={0}>
                        Encontre todas as informações da atividade com ID: #{selectedActivitie?.id}, abaixo:
                    </Text>
                </ModalHeader>
                <ModalBody>
                    <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="10px"
                        gap="6px"
                    >
                        <Tooltip label={`Status: ${formattedPriority(selectedActivitie?.priority)}`} aria-label="Status">
                            <Text
                                fontSize="lg"
                                color={selectedActivitie?.status === 1 ? "green.600" : "orange.600"}
                                bg={selectedActivitie?.status === 1 ? "green.100" : "orange.100"}
                                textAlign="center"
                                p={1}
                                paddingX={2}
                                shadow="sm"
                                rounded="6px"
                                title={`Status: ${selectedActivitie?.status === 1 ? "Concluida" : "Pendente"}`}
                            >Status: <b>{selectedActivitie?.status === 1 ? "Concluida" : "Pendente"}</b></Text>
                        </Tooltip>
                        <Tooltip label={`Prioridade: ${formattedPriority(selectedActivitie?.priority)}`} aria-label="Prioridade">
                            <Text
                                fontSize="lg"
                                color={getPriorityColor(selectedActivitie?.priority).textColor}
                                bg={getPriorityColor(selectedActivitie?.priority).bgColor}
                                textAlign="center"
                                shadow="sm"
                                p={1}
                                paddingX={2}
                                rounded="6px"
                                title={`Prioridade: ${formattedPriority(selectedActivitie?.priority)}`}
                            >Prioridade: <b>{formattedPriority(selectedActivitie?.priority)}</b></Text>
                        </Tooltip>
                    </Box>
                    <Box ><b>Tabela:</b> clients </Box>
                    <Box ><b>ID do Cliente:</b> {selectedActivitie?.record_id} </Box>
                    <Divider borderColor="gray.300" width="100%" alignSelf="center" borderWidth="2px" marginY={4} />

                    <Text display="flex" flexDirection="column" width="100%" flexWrap="wrap" gap="6px" fontWeight="bold" fontSize="md">
                        Campos inválidos:{" "}
                        {selectedActivitie?.columns.map((col, index) => (
                            <Tooltip label={`Prioridade: ${formattedPriority(col?.priority)}`} aria-label="Prioridade">
                                <Text
                                    fontSize={isMobile ? "sm" : "md"}
                                    fontWeight="normal"
                                    color={getPriorityColor(col?.priority).textColor}
                                    bg={getPriorityColor(col?.priority).bgColor}
                                    p={1}
                                    rounded="6px"
                                    padding="12px"
                                    title={`Prioridade: ${formattedPriority(col?.priority)}`}
                                >
                                    <b>{col?.column}</b>
                                    <Text>Valor: {col?.value} </Text>
                                    <Text>Sugestão: {col?.message} </Text>

                                </Text>
                            </Tooltip>
                        ))}
                    </Text>
                    <Box ><b>Auditoria foi realizada em:</b> {formattedDate(selectedActivitie?.created_at)} </Box>
                    <Box ><b>Auditoria foi atualizada em:</b> {formattedDate(selectedActivitie?.updated_at)} </Box>

                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>Voltar</Button>
                    <Button colorScheme={status === 1 ? "orange" : "green"} onClick={handleConfirm}>
                        {status === 1 ? "Marcar como Pendente" : "Concluir Atividade"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewActivitie;
