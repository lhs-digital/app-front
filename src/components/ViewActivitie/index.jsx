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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informações Gerais da Atividade</ModalHeader>
                <ModalBody>
                    <Box ><b>ID:</b> {selectedActivitie?.id} </Box>
                    <Box ><b>Primary Key Value:</b> {selectedActivitie?.primary_key_value} </Box>
                    <Box ><b>Tabela:</b> clients </Box>
                    <Box ><b>Coluna:</b> {selectedActivitie?.column} </Box>
                    <Box ><b>Erro:</b> {selectedActivitie?.message} </Box>
                    <Box ><b>Valor do campo:</b> {selectedActivitie?.value} </Box>
                    <Box ><b>Prioridade:</b> {formattedPriority(selectedActivitie?.priority)} </Box>
                    <Box ><b>Status:</b> {

                        selectedActivitie?.status === true ? 'Concluída' : 'Pendente'

                    }
                    </Box>
                    <Box ><b>Data de Criação:</b> {formattedDate(selectedActivitie?.created_at)} </Box>
                    <Box ><b>Data de Atualização:</b> {formattedDate(selectedActivitie?.updated_at)} </Box>
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
