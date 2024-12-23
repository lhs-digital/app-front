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
    Flex,
    CardFooter
} from "@chakra-ui/react"
import { useState } from 'react'
import { Select } from '@chakra-ui/react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { validarDataNascimento, validarEmail } from '../../services/utils'


const ModalFormClient = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [fields, setFields] = useState([]);

    const [form, setForm] = useState({ 
        numero: '', 
        email: '', 
        tipo_pessoa: '',
        whatsapp: '',
        data_nascimento: '',
        cnpj_cpf: '',
        referencia: '',
        contribuinte_icms: ''
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await (api.get(`/company_tables/all_tables`));
                setFields(response.data.data[0].columns);
            } catch (error) {
                console.error('Erro ao acessar as tabelas de formulário dos clientes', error);
            }
        };
        getData();
    }, [dataEdit]);


    const handleSave = () => {
        if (!form.numero || !form.email || !form.tipo_pessoa || !form.whatsapp || !form.data_nascimento || !form.cnpj_cpf || !form.referencia || !form.contribuinte_icms) {
            toast.warning('Preencha todos os campos obrigatórios')
            return;
        }

        if (!validarEmail(form.email)) {
            toast.warning('E-mail inválido')
            return;
        }

        if (!validarDataNascimento(form.data_nascimento)) {
            toast.warning('Data de nascimento inválida. O cliente deve ser maior de 18 anos.')
            return;
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {(dataEdit.id ? 'Formulário de Alteração de Cliente' : 'Formulário de Cadastro de Cliente')}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl display="flex" flexDirection="column" gap={4}>
                            {
                                fields.map((field, index) => (
                                    <Box key={index}>
                                        <FormLabel htmlFor={field.name}>{field.label} *</FormLabel>
                                        <Input
                                            id={field.name}
                                            type="text"
                                            value={form[field.name]}
                                            placeholder={"Digite o " + field.label}
                                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                                        />
                                        <Text 
                                            fontSize="xs" 
                                            color="gray.500" 
                                            mt={1}
                                        
                                        >Testando descrição do campo tal</Text>
                                    </Box>
                                ))
                            }
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

export default ModalFormClient