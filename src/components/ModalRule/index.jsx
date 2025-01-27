import React, { useContext, useEffect, useState } from 'react';
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
    Tooltip,
    Icon,
} from "@chakra-ui/react";
import { Select } from '@chakra-ui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';
import { InfoOutlineIcon } from "@chakra-ui/icons";

const ModalRule = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [listRules, setListRules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rules, setRules] = useState([]);
    const [checkedRules, setCheckedRules] = useState([]);
    const [table, setTable] = useState(dataEdit?.company_table_id || 1);
    const [column, setColumn] = useState(dataEdit?.name || "");
    const [columnLabel, setColumnLabel] = useState(dataEdit?.label || "");
    const [priority, setPriority] = useState(dataEdit?.priority || "");
    const [validations, setValidations] = useState(dataEdit?.validations || [])
    const [selectAll, setSelectAll] = useState(false);

    const { user } = useContext(AuthContext)
    const [company, setCompany] = useState("")
    const [companyId, setCompanyId] = useState(user?.user?.company?.id)
    const [companies, setCompanies] = useState([])

    const [ruleDetails, setRuleDetails] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                const responseCompany = await (api.get(`/companies/get_companies`));
                setCompanies(responseCompany.data.data);
            } catch (error) {
                console.error('Erro ao consumir as empresas do sistema', error);
            }
        };
        getData();
    }, []);

    const handleCompanyChange = (event) => {
        setCompany(event.target.value);
        setCompanyId(event.target.value);

    };

    const handleSelectAll = () => {
        if (!selectAll) {
            const allRuleIds = rules.map(rule => rule.id);
            const newRuleDetails = {};

            allRuleIds.forEach(id => {
                newRuleDetails[id] = ruleDetails[id] || { params: "", message: "" };
            });

            setListRules(allRuleIds);
            setCheckedRules(allRuleIds);
            setRuleDetails(newRuleDetails);
        } else {
            setListRules([]);
            setCheckedRules([]);
            setRuleDetails({});
        }
        setSelectAll(!selectAll);
    };


    useEffect(() => {
        const getData = async () => {
            try {
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
        setRuleDetails(prev => ({
            ...prev,
            [ruleId]: {
                ...prev[ruleId],
                [field]: value
            }
        }));
    };

    const saveData = async () => {
        const formattedRules = {};

        checkedRules.forEach(ruleId => {
            formattedRules[ruleId] = {
                message: ruleDetails[ruleId]?.message || "",
                params: ruleDetails[ruleId]?.params || ""
            };
        });

        const dataToPost = {
            column: {
                name: column,
                priority: priority,
                label: columnLabel
            },
            rules: formattedRules
        };

        if (dataEdit.id) {
            try {
                await api.put(`/company_table_columns/${dataEdit.id}/update`, dataToPost);
                toast.success('Dados editados com sucesso!');
                onClose();
                setRefresh(!refresh);
            } catch (error) {
                console.error('Erro ao editar os dados', error);
                toast.error('Erro ao editar os dados');
            }
        } else {
            try {
                await api.post(`/company_table_columns/${companyId}/rules`, dataToPost);
                toast.success('Dados salvos com sucesso!');
                onClose();
                setRefresh(!refresh);
            } catch (error) {
                console.error('Erro ao salvar os dados', error);
                toast.error('Erro ao salvar os dados');
            }
        }

        onClose()
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
            setListRules(prev => [...prev, ruleId]);
            setCheckedRules(prev => [...prev, ruleId]);
            setRuleDetails(prev => ({
                ...prev,
                [ruleId]: prev[ruleId] || { params: "", message: "" }
            }));
        } else {
            setListRules(prev => prev.filter(id => id !== ruleId));
            setCheckedRules(prev => prev.filter(id => id !== ruleId));
            setRuleDetails(prev => {
                const updated = { ...prev };
                delete updated[ruleId];
                return updated;
            });
        }
    };


    useEffect(() => {
        if (!dataEdit?.validations?.length || !rules.length) return;

        const updatedRuleDetails = {};
        const updatedCheckedRules = [];
        const updatedListRules = [];

        dataEdit.validations.forEach(validation => {
            const rule = rules.find((r) => r.name === validation.name);
            if (rule) {
                updatedRuleDetails[rule.id] = {
                    params: validation.params || "",
                    message: validation.message || ""
                };
                updatedCheckedRules.push(rule.id);
                updatedListRules.push(rule.id);
            }
        });

        setRuleDetails(updatedRuleDetails);
        setCheckedRules(updatedCheckedRules);
        setListRules(updatedListRules);
    }, [dataEdit, rules]);


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
                            {user?.user?.role?.name === "super-admin" && (
                                <Box>
                                    <FormLabel htmlFor='company'>Empresa</FormLabel>
                                    <Select
                                        id='company'
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
                            )}
                            <Box>
                                <FormLabel htmlFor='company'>Tabela</FormLabel>
                                <Select
                                    id='table'
                                    placeholder='Selecione uma opção'
                                    value={table}
                                    disabled
                                    onChange={(e) => setTable(e.target.value)}
                                >
                                    <option key={1} value={1}>clients</option>
                                </Select>
                            </Box>
                            {/* <Box>
                                <FormLabel htmlFor='table'>Tabela *</FormLabel>
                                <Input
                                    id="table"
                                    type="text"
                                    value={table}
                                    onChange={(e) => setTable(e.target.value)}
                                />
                            </Box> */}
                            <Box>
                                <FormLabel htmlFor='column'>Nome da Coluna *</FormLabel>
                                <Input
                                    id="column"
                                    type="text"
                                    value={column}
                                    onChange={(e) => setColumn(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <FormLabel htmlFor='columnLabel'>Label da Coluna *</FormLabel>
                                <Input
                                    id="columnLabel"
                                    type="text"
                                    value={columnLabel}
                                    onChange={(e) => setColumnLabel(e.target.value)}
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
                                                <b>{rule?.name}</b>
                                                <Tooltip
                                                    label={rule?.description || "Não contém."}
                                                    fontSize="sm"
                                                    placement="right"
                                                    hasArrow
                                                >
                                                    <Icon as={InfoOutlineIcon} color="gray.500" ml={2} cursor="pointer" />
                                                </Tooltip>
                                            </Checkbox>


                                            {checkedRules.includes(rule.id) && (
                                                <Box mt={2}>
                                                    <Input
                                                        placeholder="Parâmetros"
                                                        size="sm"
                                                        value={ruleDetails[rule.id]?.params || ""}
                                                        mb={2}
                                                        onChange={(e) => handleRuleChange(rule.id, 'params', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Mensagem"
                                                        size="sm"
                                                        value={ruleDetails[rule.id]?.message || ""}
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
