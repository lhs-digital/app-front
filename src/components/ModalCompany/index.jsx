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
import api from '../../services/api'
import { toast } from 'react-toastify'


const ModalCompany = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [name, setName] = useState(dataEdit.name || "")
    const [cnpj, setCnpj] = useState(dataEdit.cnpj || "")

    const saveData = async () => {
        try {
            await (api.post('/company', {
                name,
                cnpj
            }));

            setRefresh(!refresh);
            toast.success('Empresa cadastrada com sucesso!')

        } catch (error) {
            console.error('Erro ao cadastrar empresa', error);
        }
    }

    const updateUser = async () => {
        try {
            await (api.put(`/company/${dataEdit.id}`, {
                name,
                cnpj
            }));

            setRefresh(!refresh);
            toast.success('Empresa alterada com sucesso!')

        } catch (error) {
            console.error('Erro ao alterar empresa', error);
        }
    }

    const handleSave = () => {
        if (!name || !cnpj) {
            toast.warning('Preencha os campos obrigatórios: Nome e CNPJ')
            return;
        }


        if (cnpjAlreadyExists()) {
            toast.warning('CNPJ já cadastrado!')
            return
        }

        if (dataEdit.id) {
            updateUser()
        } else {
            saveData()
        }

        onClose()
    }

    const cnpjAlreadyExists = () => {
        if (dataEdit.cnpj !== cnpj && data?.length) {
            return data.find((item) => item.cnpj === cnpj)
        }

        return false;
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {(dataEdit.id ? 'Editar Empresa' : 'Cadastrar Empresa')}
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
                                <FormLabel>CNPJ *</FormLabel>
                                <Input
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                />
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

export default ModalCompany