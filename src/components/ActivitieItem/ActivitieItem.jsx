import { Box, Checkbox, Grid, ListIcon, ListItem, Text, Tooltip, useDisclosure, useTheme } from '@chakra-ui/react'
import React, { useState } from 'react'
import ViewActivitie from '../ViewActivitie';
import ModalCheckActivitie from '../ModalCheckActivitie';
import { dateFormatted } from '../../services/utils';

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
    const { isOpen: isViewOpen, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const [dataView, setDataView] = useState(activitie);
    const theme = useTheme();

    const handleView = () => {
        const selectedActivitie = dataView;
        setDataView(selectedActivitie);
        onOpenView();
    };

    const handleDelete = () => {
        onOpenDelete();
    };

    return (
        <ListItem
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #e2e8f0"
            borderLeft={`4px solid ${activitie?.status === true ? theme.colors.green[500] : theme.colors.orange[500]
                }`}
            rounded="md"
            padding="12px"
            background="white"
            _hover={{ backgroundColor: "gray.50" }}
        >
            <Tooltip >
                <ListIcon
                    size="lg"
                    as={Checkbox}
                    onChange={handleDelete}
                    isChecked={activitie?.status}
                    paddingRight="12px"
                    title={activitie?.status === true ? "Marque para alterar o status da atividade para: Pendente" : "Marque para alterar o status da atividade para: Concluída"}
                />
            </Tooltip>
            <Grid
                templateColumns="1fr"
                flex="1"
                onClick={handleView}
                cursor="pointer"
                gap={3}
                padding={0}
                margin={0}

            >
                <Box>
                    <Text fontWeight="bold" fontSize="lg">
                        ID do Cliente: <Text as="cite" fontWeight="normal">{activitie?.primary_key_value}</Text>
                    </Text>
                    <Text fontWeight="bold" fontSize='md'>Campo inválido: <Text as="cite" fontWeight="normal">{activitie?.column}</Text></Text>
                </Box>
                <Box
                    textAlign="right"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    marginLeft="auto"
                >

                    <Box>
                        {
                            activitie?.status === true ?
                                (
                                    <Text fontSize="sm" color="gray.500">Auditoria atualizada em: {dateFormatted(activitie?.updated_at)}</Text>
                                )
                                :
                                (
                                    <Text fontSize="sm" color="gray.500">Auditorado em: {dateFormatted(activitie?.created_at)}</Text>
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
                    setDataView={setDataView}
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