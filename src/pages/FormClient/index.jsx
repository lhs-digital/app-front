import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const FormClient = () => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const mockData = [
    { id: 1, name: 'João Silva', email: 'joao.silva@example.com', role: { name: 'Admin' } },
    { id: 2, name: 'Maria Oliveira', email: 'maria.oliveira@example.com', role: { name: 'User' } },
    { id: 3, name: 'Pedro Santos', email: 'pedro.santos@example.com', role: { name: 'User' } },
    { id: 4, name: 'Ana Souza', email: 'ana.souza@example.com', role: { name: 'Manager' } },
  ];

  const [data, setData] = useState(mockData);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  const filteredData = !search
    ? data
    : data.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.name.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <>
      <Header />
      <Title
        title="Gerenciamento de Clientes"
        subtitle="Informações gerais a respeito dos clientes."
      />
      <Flex align="center" justify="center" flexDirection="column" fontSize="20px" fontFamily="Poppins">
        <Box maxW={800} w="100%" py={10} px={2}>
          <Input
            mt={4}
            placeholder="Buscar cliente"
            size="lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box overflowY="auto" height="100%" mt={6}>
            <Table>
              <Thead>
                <Tr>
                  <Th onClick={() => handleSort('name')} cursor="pointer">
                    Nome {getSortIcon('name')}
                  </Th>
                  <Th onClick={() => handleSort('email')} cursor="pointer">
                    E-mail {getSortIcon('email')}
                  </Th>
                  <Th onClick={() => handleSort('role.name')} cursor="pointer">
                    Role {getSortIcon('role.name')}
                  </Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.map(({ id, name, email, role }) => (
                  <Tr key={id}>
                    <Td>{name}</Td>
                    <Td>{email}</Td>
                    <Td>{role.name}</Td>
                    <Td>
                      <EditIcon
                        fontSize={20}
                        cursor="pointer"
                        onClick={() => console.log(`Editar cliente: ${id}`)}
                      />
                      <DeleteIcon
                        fontSize={20}
                        ml={4}
                        cursor="pointer"
                        onClick={() => console.log(`Excluir cliente: ${id}`)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default FormClient;
