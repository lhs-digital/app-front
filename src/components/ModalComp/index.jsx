import React, { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box
} from "@chakra-ui/react"
import { useState } from 'react'
import { Select } from '@chakra-ui/react'
import api from '../../services/api'
import { toast } from 'react-toastify'


const ModalComp = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [name, setName] = useState(dataEdit?.name || "")
    const [email, setEmail] = useState(dataEdit?.email || "")
    const [role, setRole] = useState(dataEdit?.role || "")
    const [company, setCompany] = useState(dataEdit.company?.id || "")
    const [companies, setCompanies] = useState([])
    const [roles, setRoles] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const responseCompany = await (api.get(`/companies/get_companies`));
                setCompanies(responseCompany.data.data);
                const params = company ? { params: { company_id: company } } : {}
                const responseRole = await (api.get(`/roles/roles_from_company`, params));
                setRoles(responseRole.data.data);
            } catch (error) {
                console.error('Erro ao acessar as roles por empresa', error);
            }
        };
        getData();
    }, [setRoles, company]);

    const handleCompanyChange = (event) => {
        setCompany(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const saveData = async () => {
        try {
            await (api.post('/users', {
                name,
                email,
                company_id: company,
                role_id: role
            }));

            setRefresh(!refresh);
            toast.success('Usuário cadastrado com sucesso!')

        } catch (error) {
            console.error('Erro ao salvar usuário', error);
        }
    }

    const updateUser = async () => {
        try {
            await (api.put(`/users/${dataEdit.id}`, {
                name,
                email,
                company_id: company,
                role_id: role.id
            }));

            setRefresh(!refresh);
            toast.success('Usuário editado com sucesso!')

        } catch (error) {
            console.error('Erro ao editar usuário', error);
        }
    }

    const handleSave = () => {
        if (!name || !email || !role) {
            toast.warning('Preencha os campos obrigatórios: Nome, E-mail e Role')
            return;
        }


        if (emailAlreadyExists()) {
            toast.warning('E-mail já cadastrado!')
            return
        }

        if (dataEdit.id) {
            updateUser()
        } else {
            saveData()
        }

        onClose()
    }

    const emailAlreadyExists = () => {
        if (dataEdit.email !== email && data?.length) {
            return data.find((item) => item.email === email)
        }

        return false;
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {(dataEdit.id ? 'Editar Usuário' : 'Cadastrar Usuário')}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl display="flex" flexDirection="column" gap={4}>
                            <Box>
                                <FormLabel>Nome *</FormLabel>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>E-mail *</FormLabel>
                                <Input
                                    type="text"
                                    value={email}
                                    disabled={dataEdit?.email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Empresa</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={company}
                                    onChange={handleCompanyChange}
                                >
                                    {
                                        companies.map((companyItem) => (
                                            <option key={companyItem.id} value={companyItem.id}>{companyItem.name}</option>
                                        ))
                                    }
                                </Select>
                            </Box>
                            <Box>
                                <FormLabel>Role *</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={role?.id}
                                    onChange={handleRoleChange}
                                >
                                    {
                                        roles.map((roleItem) => (
                                            <option key={roleItem.id} value={roleItem.id}>{roleItem.name}</option>
                                        ))
                                    }
                                </Select>
                            </Box>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter justifyContent="end">
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            CANCELAR
                        </Button>
                        <Button colorScheme="green" onClick={handleSave}>
                            SALVAR
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ModalComp