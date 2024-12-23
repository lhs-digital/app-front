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
    Checkbox,
    SimpleGrid,
    Divider,
    Text,
    Grid,
    Flex
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

    const handleSelectAll = () => {
        if (!selectAll) {
            const allPermissionIds = permissions.map(permission => permission.id);
            setRolePermissions(allPermissionIds);
        } else {
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
        setCompany(event.target.value);
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

        if (dataEdit.id) {
            updateUser()
        } else {
            saveData()
        }

        onClose()
    }

    const handlePermissions = (e, permissionId) => {

        if (e.target.checked) {
            setRolePermissions(prevPermissions => [
                ...prevPermissions,
                permissionId
            ]);
        } else {
            setRolePermissions(prevPermissions =>
                prevPermissions.filter(item => item !== permissionId)
            );
        }
    }

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
                                <FormLabel htmlFor='name'>Nome *</FormLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='nivel'>Nível *</FormLabel>
                                <Input
                                    id="nivel"
                                    type="number"
                                    value={nivel}
                                    onChange={(e) => setNivel(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='company'>Empresa</FormLabel>
                                <Select
                                    id='company'
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
                                <FormLabel htmlFor='permissions'>Permissões</FormLabel>
                                <SimpleGrid columns={1} spacing={2}>
                                    {/* Categoria: Selecionar todas as permissões */}
                                    <Checkbox
                                        id="selectAll"
                                        isChecked={selectAll}
                                        onChange={handleSelectAll}
                                        width="100%"
                                    >
                                        Selecionar todas as permissões
                                    </Checkbox>

                                    {/* Mapeando as permissões */}
                                    {permissions.map((permission, index) => (
                                        <React.Fragment key={permission.id}>
                                            {/* Exibir a categoria se for diferente da anterior */}
                                            {permission.category !== permissions[index - 1]?.category && (
                                                <>
                                                    <Text><b>{permission.category}</b></Text>
                                                    <Divider />  {/* Separador entre categorias */}
                                                </>
                                            )}

                                            {/* Aqui, criamos o Grid para as permissões de uma categoria */}
                                            <Checkbox
                                                id={permission?.name}
                                                isChecked={rolePermissions.includes(permission.id)}
                                                onChange={(e) => handlePermissions(e, permission.id)}
                                            >
                                                {permission.label}
                                            </Checkbox>
                                        </React.Fragment>
                                    ))}
                                </SimpleGrid>
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
            </Modal >

        </>
    )
}

export default ModalRole