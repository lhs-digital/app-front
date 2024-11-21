import React, { useEffect, useState } from 'react';
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
    Text
} from "@chakra-ui/react";
import { Select } from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ModalRule = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [name, setName] = useState(dataEdit?.name || "");
    const [nivel, setNivel] = useState(dataEdit?.nivel);
    const [company, setCompany] = useState(dataEdit.company?.id || "");
    const [listRules, setListRules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [rules, setRules] = useState([]);
    const [checkedRules, setCheckedRules] = useState([]);
    const [table, setTable] = useState(dataEdit?.table || "");
    const [column, setColumn] = useState(dataEdit?.column || "");
    const [priority, setPriority] = useState(dataEdit?.priority || "");
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        if (!selectAll) {
            const allPermissionIds = permissions.map(permission => permission.id);
            setListRules(allPermissionIds);
        } else {
            setListRules([]);
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const responseCompany = await api.get(`/company/get_companies`);
                setCompanies(responseCompany.data.data);

                const responsePermissions = await api.get(`/permissions`);
                setPermissions(responsePermissions.data.data);

                const responseRules = await api.get(`/rules`);
                setRules(responseRules.data.data);
            } catch (error) {
                console.error('Erro ao acessar as roles por empresa', error);
            }
        };
        getData();
    }, [dataEdit]);

    const handleRuleChange = (ruleId, field, value) => {
        setRules(prevRules =>
            prevRules.map(rule =>
                rule.id === ruleId ? { ...rule, [field]: value } : rule
            )
        );
    };

    const saveData = async () => {
        const formattedRules = {};

        checkedRules.forEach(ruleId => {
            const rule = rules.find(r => r.id === ruleId);
            formattedRules[ruleId] = {
                message: rule.message || "",
                params: rule.params || ""
            };
        });

        const dataToPost = {
            column: {
                name: column,
                priority: priority
            },
            rules: formattedRules
        };

        try {
            await api.post('/company_tables/1/rules', dataToPost);
            toast.success('Dados salvos com sucesso!');
            onClose();
            setRefresh(!refresh);
        } catch (error) {
            console.error('Erro ao salvar os dados', error);
            toast.error('Erro ao salvar os dados');
        }
    };

    const handleCompanyChange = (event) => {
        setCompany(event.target.value);
    };

    const handleSave = () => {
        if (!table || !column || !priority || !listRules.length) {
            toast.warning('Preencha os campos obrigatórios: Tabela, coluna, prioridade e regras');
            return;
        }
        saveData();
    };

    const handlePermissions = (e, ruleId) => {
        if (e.target.checked) {
            setListRules(prevPermissions => [...prevPermissions, ruleId]);
        } else {
            setListRules(prevPermissions =>
                prevPermissions.filter(item => item !== ruleId)
            );
        }

        setCheckedRules(prev =>
            e.target.checked
                ? [...prev, ruleId]
                : prev.filter(id => id !== ruleId)
        );
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {(dataEdit.id ? 'Editar coluna na auditoria' : 'Adicionar coluna na auditoria')}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl display="flex" flexDirection="column" gap={4}>
                            <Box>
                                <FormLabel htmlFor='table'>Tabela *</FormLabel>
                                <Input
                                    id="table"
                                    type="text"
                                    value={table}
                                    onChange={(e) => setTable(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='column'>Coluna *</FormLabel>
                                <Input
                                    id="column"
                                    type="text"
                                    value={column}
                                    onChange={(e) => setColumn(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='priority'>Prioridade *</FormLabel>
                                <Input
                                    id="priority"
                                    type="number"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='permissions'>Regras</FormLabel>
                                <SimpleGrid columns={1} spacing={5}>
                                    <Checkbox
                                        id="selectAll"
                                        isChecked={selectAll}
                                        onChange={handleSelectAll}
                                        width="100%"
                                    >
                                        Selecionar todas as regras
                                    </Checkbox>
                                    {rules.map((rule) => (
                                        <Box key={rule.id} mb={4}>
                                            <Checkbox
                                                id={rule?.name}
                                                isChecked={listRules.includes(rule.id)}
                                                onChange={(e) => handlePermissions(e, rule.id)}
                                            >
                                                <b>{rule.name}</b>
                                                <Text>Descrição: {rule?.description || "Não contém."} </Text>
                                            </Checkbox>

                                            {checkedRules.includes(rule.id) && (
                                                <Box mt={2}>
                                                    <Input
                                                        placeholder="Parâmetros"
                                                        size="sm"
                                                        value={rule.params || ""}
                                                        mb={2}
                                                        onChange={(e) => handleRuleChange(rule.id, 'params', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Mensagem"
                                                        size="sm"
                                                        value={rule.message || ""}
                                                        onChange={(e) => handleRuleChange(rule.id, 'message', e.target.value)}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
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
            </Modal>
        </>
    );
};

export default ModalRule;
