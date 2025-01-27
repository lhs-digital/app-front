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


const ModalClient = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [email, setEmail] = useState(dataEdit?.email || "")
    const [numero, setNumero] = useState(dataEdit?.numero || "")
    const [tipoPessoa, setTipoPessoa] = useState(dataEdit?.tipo_pessoa || "")
    const [whatsapp, setWhatsapp] = useState(dataEdit?.whatsapp || "")
    const [dataNascimento, setDataNascimento] = useState(dataEdit?.data_nascimento || "")
    const [cnpjCpf, setCnpjCpf] = useState(dataEdit?.cnpj_cpf || "")
    const [referencia, setReferencia] = useState(dataEdit?.referencia || "")
    const [contribuenteIcms, setContribuenteIcms] = useState(dataEdit?.contribuinte_icms || "")

    const saveData = async () => {
        try {
            await (api.post('/clients', {
                email,
                tipoPessoa,
                whatsapp,
                dataNascimento,
                cnpjCpf,
                referencia,
                contribuenteIcms
            }));

            setRefresh(!refresh);
            toast.success('Usuário cadastrado com sucesso!')

        } catch (error) {
            console.error('Erro ao salvar usuário', error);
        }
    }

    const updateUser = async () => {
        try {
            await (api.put(`/clients/${dataEdit.id}`, {
                email,
                tipoPessoa,
                whatsapp,
                dataNascimento,
                cnpjCpf,
                referencia,
                contribuenteIcms
            }));

            setRefresh(!refresh);
            toast.success('Usuário editado com sucesso!')

        } catch (error) {
            console.error('Erro ao editar usuário', error);
        }
    }

    const handleSave = () => {
        if (!email || !numero || !tipoPessoa || !whatsapp || !dataNascimento || !cnpjCpf || !referencia || !contribuenteIcms) {
            toast.warning('Preencha os campos obrigatórios!')
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
                        {(dataEdit.id ? `Editar Cliente com ID: ${dataEdit?.id}` : 'Cadastrar Cliente')}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl display="flex" flexDirection="column" gap={4}>
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
                                <FormLabel>Número *</FormLabel>
                                <Input
                                    type="text"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Tipo de Pessoa *</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={tipoPessoa}
                                    onChange={(e) => setTipoPessoa(e.target.value)}
                                >
                                    <option value="F">Física</option>
                                    <option value="J">Jurídica</option>
                                </Select>
                            </Box>
                            <Box>
                                <FormLabel>Whatsapp *</FormLabel>
                                <Input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Data de Nascimento *</FormLabel>
                                <Input
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>CNPJ/CPF *</FormLabel>
                                <Input
                                    type="text"
                                    value={cnpjCpf}
                                    onChange={(e) => setCnpjCpf(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Referência *</FormLabel>
                                <Input
                                    type="text"
                                    value={referencia}
                                    onChange={(e) => setReferencia(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Contribuinte ICMS *</FormLabel>
                                <Select
                                    placeholder='Selecione uma opção'
                                    value={contribuenteIcms}
                                    onChange={(e) => setContribuenteIcms(e.target.value)}
                                >
                                    <option value="1">Sim</option>
                                    <option value="0">Não</option>
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

export default ModalClient