import { Box, Checkbox, Grid, ListIcon, ListItem, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import ViewActivitie from '../ViewActivitie';
import ModalCheckActivitie from '../ModalCheckActivitie';

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
    const { isOpen: isViewOpen, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const [dataView, setDataView] = useState(activitie);
    const dateFormatted = (date) => new Date(activitie?.created_at).toLocaleDateString('pt-BR');

    const handleView = () => {
        // Simulando o conjunto de dados da atividade
        const selectedActivitie = dataView;
        setDataView(selectedActivitie);
        onOpenView();
    };

    const handleDelete = () => {
        onOpenDelete(); // Abrir o modal de confirmação
    };

    return (
        <ListItem
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #e2e8f0"
            rounded="md"
            padding="12px"
            _hover={{ backgroundColor: "gray.50" }}
        >
            <ListIcon
                as={Checkbox}
                onChange={handleDelete}
                isChecked={activitie?.status}
            />
            <Grid
                templateColumns="2fr 1fr"
                flex="1"
                onClick={handleView}
                cursor="pointer"

            >
                <Box>
                    <Text fontWeight="bold" fontSize="xl">
                        #{activitie?.id}
                    </Text>
                    <Text fontWeight="bold" fontSize="xl"> Tabela: <Text as="cite" fontWeight="normal">clients</Text></Text>
                    <Text fontWeight="bold" fontSize="lg">
                        Primary Key Value: <Text as="cite" fontWeight="normal">{activitie?.primary_key_value}</Text>
                    </Text>
                    <Text fontWeight="bold" fontSize='lg'>Coluna: <Text as="cite" fontWeight="normal">{activitie?.column}</Text></Text>
                </Box>
                <Box
                    textAlign="right"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                >
                    <Text fontSize="lg">{activitie?.priority}</Text>

                    <Box>
                        {
                            activitie?.status === true ?
                                (
                                    <Text fontSize="sm" color="gray.500">Atualizado em: {dateFormatted(activitie?.updated_at)}</Text>
                                )
                                :
                                (
                                    <Text fontSize="sm" color="gray.500">Criado em: {dateFormatted(activitie?.created_at)}</Text>
                                )
                        }
                    </Box>
                </Box>
            </Grid>

            {isDeleteOpen && (
                <ModalCheckActivitie
                    id={activitie?.id}
                    status={activitie?.status}
                    isOpen={isDeleteOpen}
                    onClose={onCloseDelete}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />
            )}

            {isViewOpen && (
                <ViewActivitie
                    selectedActivitie={dataView}
                    id={activitie?.id}
                    status={activitie?.status}
                    isOpen={isViewOpen}
                    onClose={onCloseView}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />
            )}
        </ListItem>
    )
}

export default ActivitieItem