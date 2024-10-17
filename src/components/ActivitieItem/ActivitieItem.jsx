import { Box, Checkbox, Grid, ListIcon, ListItem, Text, Tooltip, useBreakpointValue, useDisclosure, useTheme } from '@chakra-ui/react'
import React, { useState } from 'react'
import ViewActivitie from '../ViewActivitie';
import ModalCheckActivitie from '../ModalCheckActivitie';
import { dateFormatted, formattedPriority, getPriorityColor } from '../../services/utils';

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
    const { isOpen: isViewOpen, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const [dataView, setDataView] = useState(activitie);
    const isMobile = useBreakpointValue({ base: true, lg: false });
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
            borderLeft={`8px solid ${activitie?.status === true ? theme.colors.green[500] : theme.colors.orange[500]
                }`}
            rounded="md"
            padding="12px"
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
                templateColumns="1fr 1fr"
                flex="1"
                onClick={handleView}
                cursor="pointer"
                gap={0}
                padding={0}
                margin={0}

            >
                <Box>
                    <Text fontWeight="bold" fontSize="xl"> Tabela: <Text as="cite" fontWeight="normal">clients</Text></Text>
                    <Text fontWeight="bold" fontSize="lg">
                        ID do Cliente: <Text as="cite" fontWeight="normal">{activitie?.primary_key_value}</Text>
                    </Text>
                    <Text fontWeight="bold" fontSize='lg'>Campo inválido: <Text as="cite" fontWeight="normal">{activitie?.column}</Text></Text>
                </Box>
                <Box
                    textAlign="right"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    marginLeft="auto"
                >
                    <Box
                        display="flex"
                        flexDirection={isMobile ? "column" : "flex"}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        marginBottom="10px"
                        gap="6px"
                    >
                        <Tooltip label={`Prioridade: ${formattedPriority(activitie?.priority)}`} aria-label="Prioridade">
                            <Text
                                fontSize={isMobile ? "sm" : "md"}
                                color={getPriorityColor(activitie?.priority).textColor}
                                bg={getPriorityColor(activitie?.priority).bgColor}
                                textAlign="center"
                                p={1}
                                rounded="6px"
                                title={`Prioridade: ${formattedPriority(activitie?.priority)}`}
                            >Prioridade: <b>{formattedPriority(activitie?.priority)}</b></Text>
                        </Tooltip>
                    </Box>

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