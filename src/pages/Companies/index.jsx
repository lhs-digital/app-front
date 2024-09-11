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
    Heading
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import ModalComp from '../../components/ModalComp';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import ModalDelete from '../../components/ModalDelete';
import ModalView from '../../components/ModalView';
import ModalViewCompany from '../../components/ModalViewCompany';
import ModalCompany from '../../components/ModalCompany';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

const Companies = () => {
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
                const response = await (api.get(`/company?page=${currentPage}`));
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
            await (api.delete(`/company/${deleteId}`));
            setRefresh(!refresh);
            toast.success('Empresa removida com sucesso!');
            onCloseDelete(); // Fechar o modal de confirmação
        } catch (error) {
            console.error('Erro ao verificar lista de usuários', error);
        }
    };

    const handleEdit = (company) => {
        setDataEdit(company);
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
            <Heading textAlign='center' mt='12px'>Gerenciamento de Empresas</Heading>
            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={10} px={2}>
                    {permissions.some(permissions => permissions.name === 'create_companies') ?
                        (
                            <Button colorScheme='blue' onClick={() => [setDataEdit({}), onOpen()]}>
                                NOVO CADASTRO
                            </Button>
                        )
                        : null
                    }


                    <Input
                        mt={4}
                        placeholder="Buscar empresa"
                        size="lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Box overflowY="auto" height="100%">
                        <Table mt="6">
                            <Thead>
                                <Tr>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">Nome</Th>
                                    <Th maxW={isMobile ? 5 : 100} fontSize="16px">CNPJ</Th>
                                    <Th p={0}></Th>
                                    <Th p={0}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {(!search ? data : data.filter(company =>
                                    company.name.toLowerCase().includes(search.toLowerCase()) ||
                                    company.cnpj.toLowerCase().includes(search.toLowerCase())
                                )).map(({ name, cnpj, roles_count, id }, index) => (
                                    <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => handleView(index)}>
                                        <Td maxW={isMobile ? 5 : 100}> {name} </Td>
                                        <Td maxW={isMobile ? 5 : 100}> {cnpj} </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'update_companies') ?
                                                (
                                                    <EditIcon
                                                        fontSize={20}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit({ name, cnpj, roles_count, id, index })
                                                        }}
                                                    />
                                                )
                                                : null
                                            }
                                        </Td>
                                        <Td p={0}>
                                            {permissions.some(permissions => permissions.name === 'update_companies') ?
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
                    <ModalCompany
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
                    <ModalViewCompany
                        selectedCompany={dataView}
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

export default Companies;
