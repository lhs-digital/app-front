import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { Box, Button, Divider, Flex, FormControl, FormLabel, Grid, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { validarCNPJ, validarCPF, validarDataNascimento, validarEmail } from '../../services/utils';


const ModalFormClient = ({ isOpen, onOpen, onClose, selectedActivitie }) => {
    const [fields, setFields] = useState([]);
    const fieldsWithErrors = selectedActivitie?.columns

    const [form, setForm] = useState({
        numero: '',
        email: '',
        tipo_pessoa: 'PF',
        whatsapp: '',
        data_nascimento: '',
        cnpj_cpf: '',
        referencia: '',
        contribuinte_icms: 'Nao'
    });

    const [filterParams, setFilterParams] = useState({
        search: '',
        method: '',
        createdAt: [],
        nivel: ""
    });

    const isMobile = useBreakpointValue({ base: true, lg: false });

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
    }, []);

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

        if (form.tipo_pessoa === 'PF' && !validarCPF(form.cnpj_cpf)) {
            toast.warning('CPF inválido')
            return;
        }

        if (form.tipo_pessoa === 'PJ' && !validarCNPJ(form.cnpj_cpf)) {
            toast.warning('CNPJ inválido')
            return;
        }

    }


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={1200} w="100%" py={10} px={2}>
                    <ModalHeader>
                        Formulário para correção de dados inválidos
                        <Text>ID do Cliente: #{selectedActivitie.id}</Text>
                        <Text color="gray.500" fontWeight="normal" fontSize="md">Os campos com borda vermelha representam os campos inválidos do Cliente</Text>
                        <Divider borderColor="gray.300" width="100%" alignSelf="center" borderWidth="1px" marginY={2} />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <FormControl display="flex" flexDirection="column" gap={4}>
                                <Grid gap={4} templateColumns={isMobile ? "1fr": "1fr 1fr"}>
                                    <Box>
                                        <FormLabel htmlFor="numero">Número da residência *</FormLabel>
                                        <Input
                                            id="numero"
                                            type="number"
                                            value={form.numero}
                                            placeholder="Digite o Número da residência"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Número de Residência') !== -1 ? '1px solid red' : undefined}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => setForm({ ...form, numero: e.target.value })}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: 123</Text>
                                    </Box>
                                    <Box>
                                        <FormLabel htmlFor="email">Email *</FormLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Email') !== -1 ? '1px solid red' : undefined}
                                            value={form.email}
                                            placeholder="Digite o Email"
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: usuario@dominio.com</Text>
                                    </Box>
                                </Grid>

                                <Grid gap={4} templateColumns={isMobile ? "1fr": "1fr 1fr"}>
                                    <Box>
                                        <FormLabel htmlFor="tipo_pessoa">Tipo de Pessoa *</FormLabel>
                                        <Select
                                            id="tipo_pessoa"
                                            value={form.tipo_pessoa}
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Tipo de Pessoa') !== -1 ? '1px solid red' : undefined}
                                            onChange={(e) => setForm({ ...form, tipo_pessoa: e.target.value, cnpj_cpf: '' })}
                                        >
                                            <option value="PF">Pessoa Física</option>
                                            <option value="PJ">Pessoa Jurídica</option>
                                        </Select>
                                        <Text fontSize="xs" color="gray.500" mt={1}>Escolha entre Pessoa Física ou Jurídica</Text>
                                    </Box>
                                    <Box>
                                        <FormLabel htmlFor="whatsapp">WhatsApp *</FormLabel>
                                        <Input
                                            id="whatsapp"
                                            type="tel"
                                            value={form.whatsapp}
                                            placeholder="Digite o WhatsApp"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Whatsapp') !== -1 ? '1px solid red' : undefined}
                                            maxLength={15}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                const formatted = value
                                                    .replace(/^(\d{2})(\d)/, '($1) $2')
                                                    .replace(/(\d{5})(\d)/, '$1-$2')
                                                    .slice(0, 15);
                                                setForm({ ...form, whatsapp: formatted });
                                            }}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: (99) 99999-9999</Text>
                                    </Box>
                                </Grid>

                                <Grid gap={4} templateColumns={isMobile ? "1fr": "1fr 1fr"}>
                                    <Box>
                                        <FormLabel htmlFor="data_nascimento">Data de Nascimento *</FormLabel>
                                        <Input
                                            id="data_nascimento"
                                            type="date"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Data de Nascimento') !== -1 ? '1px solid red' : undefined}
                                            value={form.data_nascimento}
                                            placeholder="Digite a Data de Nascimento"
                                            onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: 01/01/2000</Text>
                                    </Box>
                                    <Box>
                                        <FormLabel htmlFor="cnpj_cpf">{form.tipo_pessoa === 'PF' ? 'CPF' : 'CNPJ'} *</FormLabel>
                                        <Input
                                            id="cnpj_cpf"
                                            type="text"
                                            value={form.cnpj_cpf}
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'CPF' || field.column === 'CNPJ') !== -1 ? '1px solid red' : undefined}
                                            placeholder={form.tipo_pessoa === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ'}
                                            maxLength={form.tipo_pessoa === 'PF' ? 14 : 18}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                let formatted = value;

                                                if (form.tipo_pessoa === 'PF') {
                                                    formatted = value
                                                        .replace(/(\d{3})(\d)/, '$1.$2')
                                                        .replace(/(\d{3})(\d)/, '$1.$2')
                                                        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                                } else {
                                                    formatted = value
                                                        .replace(/(\d{2})(\d)/, '$1.$2')
                                                        .replace(/(\d{3})(\d)/, '$1.$2')
                                                        .replace(/(\d{3})(\d)/, '$1/$2')
                                                        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
                                                }

                                                setForm({ ...form, cnpj_cpf: formatted.slice(0, form.tipo_pessoa === 'PF' ? 14 : 18) });
                                            }}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            {form.tipo_pessoa === 'PF' ? 'Exemplo: 000.000.000-00' : 'Exemplo: 00.000.000/0000-00'}
                                        </Text>
                                    </Box>
                                </Grid>

                                <Grid gap={4} templateColumns={isMobile ? "1fr": "1fr 1fr"}>
                                    <Box>
                                        <FormLabel htmlFor="referencia">Referência do Endereço *</FormLabel>
                                        <Input
                                            id="referencia"
                                            type="text"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Referência do Endereço') !== -1 ? '1px solid red' : undefined}
                                            value={form.referencia}
                                            placeholder="Digite a Referência do Endereço"
                                            onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: Próximo ao mercado</Text>
                                    </Box>
                                    <Box>
                                        <FormLabel htmlFor="contribuinte_icms">Contribuinte de ICMS *</FormLabel>
                                        <Select
                                            id="contribuinte_icms"
                                            border={fieldsWithErrors?.findIndex((field) => field.column === 'Contribuinte de ICMS') !== -1 ? '1px solid red' : undefined}
                                            value={form.contribuinte_icms}
                                            onChange={(e) => setForm({ ...form, contribuinte_icms: e.target.value })}
                                        >
                                            <option value="Nao">Não</option>
                                            <option value="Sim">Sim</option>
                                        </Select>
                                        <Text fontSize="xs" color="gray.500" mt={1}>Exemplo: Sim ou Não</Text>
                                    </Box>
                                </Grid>
                            </FormControl>
                        </Box>

                    </ModalBody>
                    <ModalFooter display="flex" alignItems="center" gap={4}>
                        <Button variant="ghost" onClick={onClose}>Voltar</Button>
                        <Button colorScheme='blue' onClick={handleSave} >
                            Atualizar Dados
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>



        </>
    )
}

export default ModalFormClient