import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Text
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ModalCheckActivitie = ({ id, status, isOpen, onClose, setRefresh, refresh }) => {
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
                <ModalHeader>Confirmação de Status</ModalHeader>
                <ModalBody>
                    {
                        status === 1 ? (
                            <Text>Você tem certeza que deseja alterar o status dessa tarefa para <b>Pendente</b>?</Text>
                        ) : (
                            <Text>Você tem certeza que deseja alterar o status dessa tarefa para <b>Concluída</b>?</Text>
                        )
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button colorScheme={status === 1 ? "orange" : "green"} onClick={handleConfirm}>
                        {status === 1 ? "Marcar como Pendente" : "Concluir Atividade"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCheckActivitie;
