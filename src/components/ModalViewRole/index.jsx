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
    Checkbox,
    Wrap,
} from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ModalViewRole = ({ selectedRole, isOpen, onClose }) => {
    const [permissions, setPermissions] = useState([]);

    try {
        useEffect(() => {
            async function loadPermissions() {
                const response = await api.get(`/role/${selectedRole?.id}`);
                setPermissions(response.data.data.permissions);
            }

            loadPermissions();
        }, [selectedRole]);
    } catch (error) {
        toast.error(error);
    }

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
                    <Box>
                        <b>Permissões:</b>
                        <Wrap spacing={5} direction='row'>
                            {
                                // Se a permissão estiver no array de permissões da role, o checkbox estará marcado
                                // Se não estiver, o checkbox estará desmarcado
                                permissions.map((permission) => (
                                    <Checkbox
                                        isDisabled
                                        isChecked
                                        key={permission.id}
                                    >
                                        {permission.name}
                                    </Checkbox>
                                ))
                            }
                        </Wrap>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Voltar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalViewRole;
