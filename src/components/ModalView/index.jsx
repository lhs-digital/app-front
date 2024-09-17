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

const ModalView = ({ selectedUser, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informações Gerais do Usuário</ModalHeader>
                <ModalBody>
                    <Box ><b>Nome:</b> {selectedUser?.name} </Box>
                    <Box ><b>Email:</b> {selectedUser?.email} </Box>
                    <Box ><b>Role:</b> {selectedUser?.role?.name} </Box>
                    <Box ><b>Empresa:</b> {selectedUser?.company?.name} </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Voltar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalView;
