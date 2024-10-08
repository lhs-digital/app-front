import React from 'react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
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
    Heading,
    Divider,
    Stack
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
    const [loading, setLoading] = useState(true); // Adicionado estado de carregamento

    const { permissions } = useContext(AuthContext);

    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Ativar o carregamento
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

    const handleRemove = async () => {
        try {
            await (api.delete(`/user/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Usuário removido com sucesso!');
            onCloseDelete(); // Fechar o modal de confirmação
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
        setDeleteId(id); // Armazenar o ID do usuário que será excluído
        onOpenDelete(); // Abrir o modal de confirmação
    };

    return (
        <>
            <Header />
            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
                mt="20px"
                gap="24px"
                width="100%"
                paddingX="24px"
            >
                <Stack width="800px">

                    <Heading mt='12px'>Gerenciamento de Usuários</Heading>
                    <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
                    <Heading fontSize="lg" fontWeight="regular" color="gray.500">Administre, edite e remova usuários conforme necessário</Heading>
                </Stack>
            </Flex>

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={10} px={2}>
                    {/* Caso tenha a permissao create_users */}
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
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Nome</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">E-mail</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Role</Th>
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
                                    <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => handleView(index)}>
                                        <Td maxW={isMobile ? 5 : 100}> {name} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {email} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {role.name} </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'update_users') ?
                                                (
                                                    <EditIcon
                                                        fontSize={20}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit({ name, email, role, company, id, index })
                                                        }}
                                                    />
                                                )
                                                : null
                                            }
                                        </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'delete_users') ?
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
                        onConfirm={handleRemove} // Função de confirmação de exclusão
                    />
                )}

                {isViewOpen && (
                    <ModalView
                        selectedUser={dataView}
                        isOpen={isViewOpen}
                        onClose={onCloseView}
                    />
                )}

                <Box maxW={800} py={5} px={2}>
                    {Array.from({ length: lastPage }, (_, i) => (
                        <Button
                            ml="6px"
                            color={currentPage === i + 1 ? 'white' : 'black'}
                            backgroundColor={currentPage === i + 1 ? 'blue.500' : 'gray.200'}
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </Box>
            </Flex>
        </>
    );
};

export default Users;
