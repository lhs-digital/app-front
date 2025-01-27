import React, { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { Avatar, Box, Button, Flex, FormControl, FormLabel, Grid, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import ModalReport from '../../components/ModalReport'
import { DeleteIcon, DownloadIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import Pagination from '../../components/Pagination'
import { AuthContext } from '../../contexts/auth'

const ReportsAud = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [refresh, setRefresh] = useState(false);
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    const { permissions } = useContext(AuthContext);

    return (
        <>
            <Header />

            <Title title="Relatórios de Auditorias" subtitle="Administração e gerenciamento dos relatórios das auditorias" />

            <Flex
                align="center"
                justify="center"
                flexDirection="column"
                fontSize="20px"
                fontFamily="poppins"
            >
                <Box maxW={800} w="100%" py={4} px={2}>

                    {permissions.some(permissions => permissions.name === 'report_generate') ?
                        (
                            <Button colorScheme='blue' marginBottom="6px" onClick={() => onOpen()}>
                                GERAR RELATÓRIO
                            </Button>
                        )
                        : null
                    }
                </Box>
            </Flex>

            {isOpen && (
                <ModalReport
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}

        </>
    )
}

export default ReportsAud
