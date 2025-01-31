import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, Select, TextField } from "@mui/material"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../services/api'


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
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                {(dataEdit.id ? 'Editar Usuário' : 'Cadastrar Usuário')}
            </DialogTitle>
            <DialogContent className='w-[480px] flex flex-col gap-4'>
                <Box>
                    <InputLabel>Nome *</InputLabel>
                    <TextField
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box>
                    <InputLabel>E-mail *</InputLabel>
                    <TextField
                        type="text"
                        value={email}
                        disabled={dataEdit?.email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box>
                    <InputLabel>Empresa</InputLabel>
                    <Select
                        placeholder='Selecione uma opção'
                        value={company}
                        onChange={handleCompanyChange}
                        fullWidth
                    >
                        {
                            companies.map((companyItem) => (
                                <option key={companyItem.id} value={companyItem.id}>{companyItem.name}</option>
                            ))
                        }
                    </Select>
                </Box>
                <Box>
                    <InputLabel>Role *</InputLabel>
                    <Select
                        placeholder='Selecione uma opção'
                        value={role?.id}
                        onChange={handleRoleChange}
                        fullWidth
                    >
                        {
                            roles.map((roleItem) => (
                                <option key={roleItem.id} value={roleItem.id}>{roleItem.name}</option>
                            ))
                        }
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                    CANCELAR
                </Button>
                <Button colorScheme="green" onClick={handleSave}>
                    SALVAR
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModalComp