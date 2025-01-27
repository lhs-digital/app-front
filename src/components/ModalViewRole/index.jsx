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
                const response = await api.get(`/roles/${selectedRole?.id}`);
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
                        <Box textAlign="justify" px={2}>
                            {permissions.length > 0 ? (
                                permissions
                                    .reduce((acc, permission) => {
                                        const categoryExists = acc.find((cat) => cat.category === permission.category);
                                        if (!categoryExists) {
                                            acc.push({ category: permission.category, items: [] });
                                        }
                                        acc.find((cat) => cat.category === permission.category)?.items.push(permission);
                                        return acc;
                                    }, [])
                                    .map((group, index) => (
                                        <Box key={index} mb={4} width="100%">
                                            <b>{group.category}</b>
                                            <Wrap spacing={5} direction="row" mt={2}>
                                                {group.items.map((permission) => (
                                                    <Checkbox
                                                        key={permission.id}
                                                        isChecked
                                                        isDisabled
                                                    >
                                                        {permission.label}
                                                    </Checkbox>
                                                ))}
                                            </Wrap>
                                        </Box>
                                    ))
                            ) : (
                                <span>Não possui permissões habilitadas</span>
                            )}
                        </Box>
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
