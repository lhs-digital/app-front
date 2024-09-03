import React from 'react'
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


const ModalComp = ({ data, setData, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [name, setName] = useState(dataEdit.name || "")
    const [email, setEmail] = useState(dataEdit.email || "")
    const [role, setRole] = useState(dataEdit.role || "")

    const handleRoleChange = (event) => {
        setRole(event.target.value); // Atualiza o estado com o valor selecionado
    };

    const saveData = async () => {
        try {
            await (api.post('/user', {
                name,
                email,
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
            await (api.put(`/user/${dataEdit.id}`, {
                name,
                email,
                role_id: role
            }));

            setRefresh(!refresh);
            toast.success('Usuário editado com sucesso!')

        } catch (error) {
            console.error('Erro ao editar usuário', error);
        }
    }

    const handleSave = () => {
        if (!name || !email || !role) {
            toast.warning('Preencha todos os campos!')
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
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>E-mail</FormLabel>
                                <Input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={role}
                                    onChange={handleRoleChange}
                                >
                                    <option value='1'>Administrador</option>
                                    <option value='2'>Técnico</option>
                                </Select>
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

export default ModalComp