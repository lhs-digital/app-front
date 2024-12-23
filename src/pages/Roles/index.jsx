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
    Input,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import ModalDelete from '../../components/ModalDelete';
import ModalRole from '../../components/ModalRole';
import ModalViewRole from '../../components/ModalViewRole';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import Title from '../../components/Title'
import Pagination from '../../components/Pagination';

const Roles = () => {
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
    const { permissions } = useContext(AuthContext);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await (api.get(`/role?page=${currentPage}`));
                setCurrentPage(response.data.meta.current_page);
                setLastPage(response.data.meta.last_page);
                setData(response.data.data);
            } catch (error) {
                console.error('Erro ao verificar lista de usuários', error);
            }
        };
        getData();
    }, [setData, currentPage, lastPage, refresh]);

    const handleRemove = async () => {
        try {
            await (api.delete(`/role/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Role removida com sucesso!');
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
        const selectedRole = data;
        setDataView(selectedRole[index]);
        onOpenView();
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        onOpenDelete();
    };

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

    return (
        <>
            <Header />

            <Title title="Gerenciamento de Roles" subtitle="Administração e atribuição de permissões e funções de usuários" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={10} px={2}>
                    {permissions.some(permissions => permissions.name === 'create_roles') ?
                        (
                            <Button colorScheme='blue' onClick={() => [setDataEdit({}), onOpen()]}>
                                NOVO CADASTRO
                            </Button>
                        )
                        : null
                    }

                    <Input
                        mt={4}
                        placeholder="Buscar role"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Box overflowY="auto" height="100%">
                        <Table mt="6">
                            <Thead>
                                <Tr>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" cursor="pointer" onClick={() => handleSort('name')}>Nome {getSortIcon('name')}</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" cursor="pointer" onClick={() => handleSort('company.name')}>Empresa {getSortIcon('company.name')}</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px" cursor="pointer" onClick={() => handleSort('permissions_count')}>Qtd Permissões {getSortIcon('permissions_count')}</Th>
                                    <Th p={0}></Th>
                                    <Th p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(!search ? data : data.filter(role =>
                                    role.name.toLowerCase().includes(search.toLowerCase()) ||
                                    role.company?.name.toLowerCase().includes(search.toLowerCase())
                                )).map(({ name, nivel, company, permissions_count, id }, index) => (
                                    <Tr key={index} cursor="pointer"
                                        _hover={{ bg: "gray.50" }}
                                        _odd={{ bg: "gray.100" }}
                                        _even={{ bg: "white" }}
                                        onClick={() => handleView(index)}>
                                        <Td maxW={isMobile ? 5 : 100}> {name} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {company?.name} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {permissions_count} </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'update_roles') ?
                                                (
                                                    <EditIcon
                                                        fontSize={20}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit({ name, nivel, company, id, index })
                                                        }}
                                                    />
                                                )
                                                : null
                                            }
                                        </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'delete_roles') ?
                                                (
                                                    <DeleteIcon
                                                        fontSize={20}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(id)
                                                        }}
                                                    />
                                                )
                                                : null
                                            }

                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

                {isOpen && (
                    <ModalRole
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
                    <ModalViewRole
                        selectedRole={dataView}
                        isOpen={isViewOpen}
                        onClose={onCloseView}
                    />
                )}

                <Pagination currentPage={currentPage} lastPage={lastPage} setCurrentPage={setCurrentPage} />
            </Flex>
        </>
    );
};

export default Roles;
