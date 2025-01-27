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
import { dateFormatted } from '../../services/utils';

const ModalClient = ({ selectedUser, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informações Gerais do Usuário</ModalHeader>
                <ModalBody>
                    <Box><b>Id:</b> {selectedUser?.id || 'Não disponível'} </Box>
                    <Box><b>Número:</b> {selectedUser?.numero || 'Não disponível'} </Box>
                    <Box><b>Email:</b> {selectedUser?.email || 'Não disponível'} </Box>
                    <Box><b>Cnpj/Cpf:</b> {selectedUser?.cnpj_cpf || 'Não disponível'} </Box>
                    <Box><b>Contribuinte Icms:</b> {selectedUser?.contribuinte_icms === '1' ? 'Sim' : 'Não'} </Box>
                    <Box><b>Data Nascimento:</b> {selectedUser?.data_nascimento || 'Não disponível'} </Box>
                    <Box><b>Whatsapp:</b> {selectedUser?.whatsapp || 'Não disponível'} </Box>
                    <Box><b>Referência:</b> {selectedUser?.referencia || 'Não disponível'} </Box>
                    <Box><b>Tipo de Pessoa:</b> {selectedUser?.tipo_pessoa || 'Não disponível'} </Box>
                    <Box><b>Criado em:</b> {dateFormatted(selectedUser?.created_at) || 'Não disponível'} </Box>
                    <Box><b>Atualizado em:</b> {dateFormatted(selectedUser?.created_at) || 'Não disponível'} </Box>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Voltar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalClient;
