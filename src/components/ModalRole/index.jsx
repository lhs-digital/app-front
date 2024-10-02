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
    Box,
    Stack,
    Checkbox,
    Wrap
} from "@chakra-ui/react"
import { useState } from 'react'
import { Select } from '@chakra-ui/react'
import api from '../../services/api'
import { toast } from 'react-toastify'


const ModalRole = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [name, setName] = useState(dataEdit?.name || "")
    const [nivel, setNivel] = useState(dataEdit?.nivel)
    const [company, setCompany] = useState(dataEdit.company?.id || "")
    const [rolePermissions, setRolePermissions] = useState([])
    const [permissions, setPermissions] = useState([])
    const [companies, setCompanies] = useState([])

    const [selectAll, setSelectAll] = useState(false);

    // Função para selecionar ou desmarcar todas as permissões
    const handleSelectAll = () => {
        if (!selectAll) {
            // Marca todas as permissões
            const allPermissionIds = permissions.map(permission => permission.id);
            setRolePermissions(allPermissionIds);
        } else {
            // Desmarca todas as permissões
            setRolePermissions([]);
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const responseCompany = await (api.get(`/company/get_companies`));
                setCompanies(responseCompany.data.data);
                const responsePermissions = await (api.get(`/permissions`));
                setPermissions(responsePermissions.data.data);

                if (dataEdit) {
                    const responsePermissions = await (api.get(`/role/${dataEdit.id}`));
                    setRolePermissions(responsePermissions.data.data.permissions.map(permission => permission.id));
                }
            } catch (error) {
                console.error('Erro ao acessar as roles por empresa', error);
            }
        };
        getData();
    }, [dataEdit]);

    const saveData = async () => {
        try {
            await (api.post('/role', {
                name,
                nivel,
                company_id: company,
                permissions: rolePermissions
            }));

            setRefresh(!refresh);
            toast.success('Role cadastrada com sucesso!')

        } catch (error) {
            console.error('Erro ao cadastrar Role', error);
        }
    }

    const handleCompanyChange = (event) => {
        setCompany(event.target.value); // Atualiza o estado com o valor selecionado
    };

    const updateUser = async () => {
        try {
            await (api.put(`/role/${dataEdit.id}`, {
                name,
                nivel,
                company_id: company,
                permissions: rolePermissions
            }));

            setRefresh(!refresh);
            toast.success('Role alterada com sucesso!')

        } catch (error) {
            console.error('Erro ao alterar Role', error);
        }
    }

    const handleSave = () => {
        if (!name || !nivel) {
            toast.warning('Preencha os campos obrigatórios: Nome, Nível e Empresa')
            return;
        }


        // if (cnpjAlreadyExists()) {
        //     toast.warning('CNPJ já cadastrado!')
        //     return
        // }

        if (dataEdit.id) {
            updateUser()
        } else {
            saveData()
        }

        onClose()
    }

    // const cnpjAlreadyExists = () => {
    //     if (dataEdit.cnpj !== cnpj && data?.length) {
    //         return data.find((item) => item.cnpj === cnpj)
    //     }

    //     return false;
    // }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {(dataEdit.id ? 'Editar Role' : 'Cadastrar Role')}
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
                                <FormLabel>Nível *</FormLabel>
                                <Input
                                    type="number"
                                    value={nivel}
                                    onChange={(e) => setNivel(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Empresa</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={company}
                                    disabled={dataEdit.company?.id}
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
                                <FormLabel>Permissões</FormLabel>
                                <Wrap spacing={5} direction='row'>
                                    <Checkbox
                                        isChecked={selectAll}
                                        onChange={handleSelectAll}
                                        width="100%"
                                    >Selecionar todas as permissões</Checkbox>
                                    {
                                        // Se a permissão estiver no array de permissões da role, o checkbox estará marcado
                                        // Se não estiver, o checkbox estará desmarcado
                                        permissions.map((permission) => (
                                            <Checkbox
                                                isChecked={rolePermissions.includes(permission.id)}
                                                key={permission.id}
                                                value={permission.id}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setRolePermissions(prevPermissions => [
                                                            ...prevPermissions,
                                                            permission.id
                                                        ])
                                                    } else {
                                                        setRolePermissions(prevPermissions =>
                                                            prevPermissions.filter(item => item !== permission.id))
                                                    }
                                                }}>
                                                {permission.name}
                                            </Checkbox>
                                        ))
                                    }
                                </Wrap>
                            </Box>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter justifyContent="start">
                        <Button colorScheme="green" mr={3} onClick={handleSave}>
                            SALVAR
                        </Button>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            CANCELAR
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ModalRole