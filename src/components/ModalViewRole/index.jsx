import React, { useEffect, useState } from 'react';
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

const ModalViewRole = ({ selectedRole, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informações Gerais da Role</ModalHeader>
                <ModalBody>
                    <Box ><b>Nome:</b> {selectedRole?.name} </Box>
                    <Box ><b>Nível:</b> {selectedRole?.nivel} </Box>
                    <Box ><b>Empresa:</b> {selectedRole?.company?.cnpj} {selectedRole?.company?.name} </Box>
                    <Box ><b>Qtd. de Permissões:</b> {selectedRole?.permissions_count} </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Voltar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalViewRole;
