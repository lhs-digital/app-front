import React, { useState, useEffect, useContext } from 'react';
import { EditIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Button,
    useDisclosure,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useBreakpointValue,
    Input,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import ModalClient from '../../components/ModalClient';
import Title from '../../components/Title';
import Pagination from '../../components/Pagination';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import ModalDeleteClient from '../../components/ModalDeleteClient';
import ModalViewClient from '../../components/ModalViewClient';

const Clients = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const { isOpen: isViewOpen, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();

    const [data, setData] = useState([]);
    const [dataEdit, setDataEdit] = useState({});
    const [dataView, setDataView] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    const { permissions } = useContext(AuthContext);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/clients?page=${currentPage}`);
                setData(response.data.data);
                setCurrentPage(response.data.from);
                setLastPage(response.data.last_page);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
                toast.error('Erro ao carregar a lista de clientes.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [currentPage, refresh]);

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedData = [...data].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({ key, direction });
        setData(sortedData);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUpIcon ml={2} /> : <ChevronDownIcon ml={2} />;
    };

    const handleRemove = async () => {
        try {
            await (api.delete(`/clients/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Client removido com sucesso!');
            onCloseDelete();
        } catch (error) {
            console.error(`Erro ao delter cliente com ID: ${deleteId}`, error);
        }
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        onOpenDelete();
    };

    const handleEdit = (client) => {
        setDataEdit(client);
        onOpen();
    };

    const handleView = (client) => {
        setDataView(client);
        onOpenView();
    };

    return (
        <>
            <Header />
            <Title title="Gerenciamento de Clientes" subtitle="Administre, edite e remova clientes conforme necessário" />
            <Flex align="center" justify="center" flexDirection="column" fontSize="20px" fontFamily="poppins">
                <Box maxW={800} w="100%" py={10} px={2}>
                    {permissions.some((perm) => perm.name === 'create_users') && (
                        <Button colorScheme="blue" onClick={() => [setDataEdit({}), onOpen()]}>
                            NOVO CADASTRO
                        </Button>
                    )}
                    <Input
                        mt={4}
                        placeholder="Buscar cliente"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box overflowY="auto" height="100%">
                        <Table mt={6}>
                            <Thead>
                                <Tr>
                                    <Th maxW={isMobile ? 5 : 5} fontSize="16px" onClick={() => handleSort('id')} cursor="pointer">
                                        ID {getSortIcon('id')}
                                    </Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" onClick={() => handleSort('email')} cursor="pointer">
                                        Email {getSortIcon('email')}
                                    </Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" onClick={() => handleSort('cnpj_cpf')} cursor="pointer">
                                        CNPJ/CPF {getSortIcon('cnpj_cpf')}
                                    </Th>
                                    <Th p={0}></Th>
                                    <Th p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(data.length === 0) ? (
                                    <Tr>
                                        <Td colSpan="5" textAlign="center">Nenhum cliente encontrado</Td>
                                    </Tr>
                                ) : (
                                    data.filter((client) =>
                                            [client.id, client.email, client.cnpj_cpf, client.whatsapp]
                                                .some((field) =>
                                                    field.toString().toLowerCase().includes(search.toLowerCase())
                                                )
                                        )
                                        .map((client, index) => (
                                            <Tr
                                                key={client.id}
                                                cursor="pointer"
                                                _hover={{ bg: "gray.50" }}
                                                _odd={{ bg: "gray.100" }}
                                                _even={{ bg: "white" }}
                                                onClick={() => handleView(client)}
                                            >
                                                <Td maxW={isMobile ? 5 : 100}>{client.id}</Td>
                                                <Td maxW={isMobile ? 5 : 100}>{client.email}</Td>
                                                <Td maxW={isMobile ? 5 : 100}>{client.cnpj_cpf}</Td>
                                                <Td p={0}>
                                                    {permissions.some((perm) => perm.name === 'update_users') && (
                                                        <EditIcon
                                                            fontSize={20}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(client)
                                                            }}
                                                            cursor="pointer"
                                                        />
                                                    )}
                                                </Td>
                                                <Td p={0}>
                                                    {permissions.some((perm) => perm.name === 'delete_users') && (
                                                        <DeleteIcon
                                                            fontSize={20}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(client?.id)
                                                            }}
                                                            cursor="pointer"
                                                        />
                                                    )}
                                                </Td>
                                            </Tr>
                                        )))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
                {isOpen && (
                    <ModalClient
                        isOpen={isOpen}
                        onClose={onClose}
                        data={data}
                        setData={setData}
                        dataEdit={dataEdit}
                        setDataEdit={setDataEdit}
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />
                )}
                {isDeleteOpen && <ModalDeleteClient isOpen={isDeleteOpen} onClose={onCloseDelete} onConfirm={handleRemove} />}
                {isViewOpen && <ModalViewClient isOpen={isViewOpen} onClose={onCloseView} selectedUser={dataView} />}
                <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
            </Flex>
        </>
    );
};

export default Clients;
