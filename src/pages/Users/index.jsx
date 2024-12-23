import React from 'react';
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
    Input
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import ModalComp from '../../components/ModalComp';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import ModalDelete from '../../components/ModalDelete';
import ModalView from '../../components/ModalView';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import Title from '../../components/Title';
import Pagination from '../../components/Pagination';

const Users = () => {
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
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });


    const { permissions } = useContext(AuthContext);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await (api.get(`/user?page=${currentPage}`));
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
    }, [setData, currentPage, lastPage, refresh]);

    const handleSort = (key) => {
        const direction = sortConfig.direction === 'asc' && sortConfig.key === key ? 'desc' : 'asc';

        const sortedData = [...data].sort((a, b) => {
            const aKey = key.split('.').reduce((acc, part) => acc && acc[part], a);
            const bKey = key.split('.').reduce((acc, part) => acc && acc[part], b);

            if (aKey < bKey) return direction === 'asc' ? -1 : 1;
            if (aKey > bKey) return direction === 'asc' ? 1 : -1;
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
            await (api.delete(`/user/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Usuário removido com sucesso!');
            onCloseDelete();
        } catch (error) {
            console.error('Erro ao verificar lista de usuários', error);
        }
    };

    const handleEdit = (user) => {
        setDataEdit(user);
        onOpen();
    };

    const handleView = (index) => {
        const selectedUser = data;
        setDataView(selectedUser[index]);
        onOpenView();
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        onOpenDelete();
    };

    return (
        <>
            <Header />

            <Title title="Gerenciamento de Usuários" subtitle="Administre, edite e remova usuários conforme necessário" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={10} px={2}>
                    {permissions.some(permissions => permissions.name === 'create_users') ?
                        (
                            <Button colorScheme='blue' onClick={() => [setDataEdit({}), onOpen()]}>
                                NOVO CADASTRO
                            </Button>
                        )
                        : null
                    }

                    <Input
                        mt={4}
                        placeholder="Buscar usuário"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Box overflowY="auto" height="100%">
                        <Table mt="6">
                            <Thead>
                                <Tr>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" onClick={() => handleSort('name')} cursor="pointer">
                                        Nome
                                        {getSortIcon('name')}
                                    </Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" onClick={() => handleSort('email')} cursor="pointer">
                                        E-mail
                                        {getSortIcon('email')}
                                    </Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" onClick={() => handleSort('role.name')} cursor="pointer">
                                        Role
                                        {getSortIcon('role.name')}
                                    </Th>
                                    <Th p={0}></Th>
                                    <Th p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(!search ? data : data.filter(user =>
                                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                                    user.role.name.toLowerCase().includes(search.toLowerCase())
                                )).map(({ name, email, role, company, id }, index) => (
                                    <Tr
                                        key={index}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.50" }}
                                        _odd={{ bg: "gray.100" }}
                                        _even={{ bg: "white" }}
                                        onClick={() => handleView(index)}
                                    >
                                        <Td maxW={isMobile ? 5 : 100}> {name} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {email} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {role.name} </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'update_users') &&
                                                <EditIcon
                                                    fontSize={20}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit({ name, email, role, company, id, index })
                                                    }}
                                                />
                                            }
                                        </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'delete_users') &&
                                                <DeleteIcon
                                                    fontSize={20}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(id)
                                                    }}
                                                />
                                            }
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

                {isOpen && (
                    <ModalComp
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
                    <ModalDelete
                        isOpen={isDeleteOpen}
                        onClose={onCloseDelete}
                        onConfirm={handleRemove}
                    />
                )}

                {isViewOpen && (
                    <ModalView
                        selectedUser={dataView}
                        isOpen={isViewOpen}
                        onClose={onCloseView}
                    />
                )}

                <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
            </Flex>
        </>
    );
};

export default Users;
