import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Flex, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import api from '../../services/api';
import ModalRule from '../../components/ModalRule';
import { toast } from 'react-toastify';
import ModalRuleDelete from '../../components/ModalRuleDelete';

const Priorities = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
    const [data, setData] = useState([]);
    const [dataEdit, setDataEdit] = useState({});
    const [deleteId, setDeleteId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [lastPage, setLastPage] = useState(null);
    const [createdAt, setCreatedAt] = useState([]);
    const [loading, setLoading] = useState(false);
    const [table, setTable] = useState('');
    const [method, setMethod] = useState("");
    const [nivel, setNivel] = useState("");
    const [refresh, setRefresh] = useState(false);

    const [filterParams, setFilterParams] = useState({
        search: '',
        method: '',
        createdAt: [],
        nivel: ""
    });
    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const params = {
                    search: filterParams?.search || undefined,
                    method: filterParams?.method || undefined,
                    nivel: filterParams?.nivel || undefined,
                    created_at: filterParams?.createdAt && filterParams?.createdAt.length > 0 ? [filterParams.createdAt[0], filterParams.createdAt[1]] : undefined
                };

                const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

                const response = await api.get(`/company_tables?page=${currentPage}`, {
                    params: filteredParams
                });

                setCurrentPage(response.data.meta.current_page);
                setLastPage(response.data.meta.last_page);
                setData(response.data.data);
            } catch (error) {
                console.error('Erro ao verificar lista de usuários', error);
            } finally {
                setLoading(false)
            }
        };
        getData();
    }, [currentPage, refresh, filterParams]);

    const handleEdit = (column) => {
        setDataEdit(column);
        onOpen();
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        onOpenDelete();
    };

    const handleRemove = async () => {
        try {
            await (api.delete(`/company_table_columns/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Regra removida com sucesso!');
            onCloseDelete();
        } catch (error) {
            console.error('Erro ao remover regra', error);
        }
    };

    return (
        <>
            <Header />

            <Title title="Regras de Auditorias" subtitle="Administração e supervisão das regras das auditorias" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={10} px={2}>

                    <Button colorScheme='blue' onClick={() => [setDataEdit({}), onOpen()]}>
                        ADICIONAR COLUNA NA AUDITORIA
                    </Button>

                    <Box overflowY="auto" height="100%" marginTop="12px">
                        <Accordion allowMultiple>
                            {data.map((table) => (
                                <AccordionItem key={table.id}>
                                    {({ isExpanded }) => (
                                        <>
                                            <h2>
                                                <AccordionButton
                                                    _expanded={{ bg: '#1A202C', color: 'white' }}
                                                    bg={isExpanded ? '#1A202C' : 'gray.100'}
                                                >
                                                    <Box flex="1" textAlign="left">
                                                        Tabela: {table.label}
                                                    </Box>
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                <Accordion allowMultiple>
                                                    {table.columns.map((column) => (
                                                        <AccordionItem key={column.id}>
                                                            {({ isExpanded }) => (
                                                                <>
                                                                    <h3>
                                                                        <AccordionButton
                                                                            _expanded={{ bg: 'green.500', color: 'white' }}
                                                                            bg={isExpanded ? 'green.500' : 'gray.100'}
                                                                        >
                                                                            <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
                                                                                Coluna: {column.label}
                                                                                <Box display="flex" justifyContent="space-between" alignItems="center" gap="12px">
                                                                                    <EditIcon fontSize={20}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleEdit(column)
                                                                                        }}
                                                                                    />
                                                                                    <DeleteIcon fontSize={20} onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDelete(column.id)
                                                                                    }} />
                                                                                </Box>
                                                                            </Box>
                                                                        </AccordionButton>
                                                                    </h3>
                                                                    <AccordionPanel pb={4}>
                                                                        <Table variant="simple">
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Nome</Th>
                                                                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Parâmetros</Th>
                                                                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Mensagem</Th>
                                                                                    <Th p={0}></Th>
                                                                                    <Th p={0}></Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    data.length === 0 ? (
                                                                                        <Tr>
                                                                                            <Td colSpan={4} textAlign="center">
                                                                                                Não existem Regras de Auditorias no sistema
                                                                                            </Td>
                                                                                        </Tr>
                                                                                    ) : (
                                                                                        column.validations.map((validation) => (
                                                                                            <Tr key={validation.id} cursor="pointer" _hover={{ bg: "gray.100" }}>
                                                                                                <Td maxW={isMobile ? 5 : 100}>{validation.rule.label}</Td>
                                                                                                <Td maxW={isMobile ? 5 : 100}>{validation.rule.has_params}</Td>
                                                                                                <Td maxW={isMobile ? 5 : 100}>{validation.message || "N/A"}</Td>
                                                                                            </Tr>
                                                                                        )))}
                                                                            </Tbody>
                                                                        </Table>
                                                                    </AccordionPanel>
                                                                </>
                                                            )}
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            </AccordionPanel>
                                        </>
                                    )}
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Box>
                </Box>
                {isOpen && (
                    <ModalRule
                        isOpen={isOpen}
                        onClose={onClose}
                        data={data}
                        setData={setData}
                        dataEdit={dataEdit}
                        setDataEdit={setDataEdit}
                        setRefresh={setRefresh}
                        refresh={refresh}
                    />
                )}

                {isDeleteOpen && (
                    <ModalRuleDelete
                        isOpen={isDeleteOpen}
                        onClose={onCloseDelete}
                        onConfirm={handleRemove}
                    />
                )}
            </Flex>
        </>
    )
}

export default Priorities