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
} from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ViewActivitie = ({ id, status, selectedActivitie, setRefresh, refresh, isOpen, onClose }) => {
    const formattedDate = (date) => new Date(date).toLocaleDateString('pt-BR');
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

    const formattedPriority = (priority) => {
        switch (priority) {
            case 1:
                return "Muito Baixa";
            case 2:
                return "Baixa";
            case 3:
                return "Média";
            case 4:
                return "Alta";
            case 5:
                return "Urgente";
            default:
                return "Muito Baixa"
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 1:
                return { textColor: 'gray.600', bgColor: 'gray.100' }; // Muito Baixa
            case 2:
                return { textColor: 'blue.600', bgColor: 'blue.100' }; // Baixa
            case 3:
                return { textColor: 'yellow.600', bgColor: 'yellow.100' }; // Média
            case 4:
                return { textColor: 'orange.600', bgColor: 'orange.100' }; // Alta
            case 5:
                return { textColor: 'red.600', bgColor: 'red.100' }; // Crítica
            default:
                return { textColor: 'black', bgColor: 'gray.300' }; // Desconhecida
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
                <Divider borderColor="gray.300" width="90%" alignSelf="center" borderWidth="2px" marginBottom={4} />
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
                                color={selectedActivitie?.status === true ? "green.600" : "orange.600"}
                                bg={selectedActivitie?.status === true ? "green.100" : "orange.100"}
                                textAlign="center"
                                p={1}
                                paddingX={2}
                                shadow="sm"
                                rounded="6px"
                                title={`Status: ${selectedActivitie?.status === true ? "Concluida" : "Pendente"}`}
                            >Status: <b>{selectedActivitie?.status === true ? "Concluida" : "Pendente"}</b></Text>
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
                    <Box ><b>ID do Cliente:</b> {selectedActivitie?.primary_key_value} </Box>
                    <Box ><b>Tabela:</b> clients </Box>
                    <Box ><b>Campo inválido:</b> {selectedActivitie?.column} </Box>
                    <Box ><b>Mensagem de Erro:</b> {selectedActivitie?.message} </Box>
                    <Box ><b>Valor do campo:</b>
                        {selectedActivitie?.value === "" ? ' O campo possui um valor nulo' : selectedActivitie?.value}
                    </Box>
                    <Box ><b>Data em que a Auditoria foi realizada:</b> {formattedDate(selectedActivitie?.created_at)} </Box>
                    <Box ><b>Data em que a Auditoria foi atualizada:</b> {formattedDate(selectedActivitie?.updated_at)} </Box>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>Voltar</Button>
                    <Button colorScheme={status === true ? "orange" : "green"} onClick={handleConfirm}>
                        {status === true ? "Marcar como Pendente" : "Concluir Atividade"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewActivitie;
