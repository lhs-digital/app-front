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

const ModalViewCompany = ({ selectedCompany, isOpen, onClose }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const responseRole = await (api.get(`/roles/roles_from_company`, { params: { company_id: selectedCompany.id } }));
                setRoles(responseRole.data.data);
            } catch (error) {
                console.error('Erro ao acessar as roles por empresa', error);
            }
        };
        getData();
    }, [setRoles, selectedCompany]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Informações Gerais da Empresa</ModalHeader>
                <ModalBody>
                    <Box ><b>Nome:</b> {selectedCompany?.name} </Box>
                    <Box ><b>CPNJ:</b> {selectedCompany?.cnpj} </Box>
                    <Box ><b>Roles:</b>
                        {roles?.map((role) => (
                            <Box key={role.id} ml="4">{role.name}</Box>
                        ))}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Voltar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalViewCompany;
