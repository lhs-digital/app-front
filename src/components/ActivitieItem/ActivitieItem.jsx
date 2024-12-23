import { Box, Checkbox, Divider, Grid, Icon, ListIcon, ListItem, Text, Tooltip, useBreakpointValue, useDisclosure, useTheme } from '@chakra-ui/react'
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
            borderLeft={`4px solid ${activitie?.status === 1 ? theme.colors.green[500] : theme.colors.orange[500]
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
                    title={activitie?.status === 1 ? "Marque para alterar o status da atividade para: Pendente" : "Marque para alterar o status da atividade para: Concluída"}
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
                <Box marginLeft="12px">
                    <Box display="flex" justifyContent="space-between">
                        <Text fontWeight="bold" fontSize="lg">
                            ID do Cliente: <Text as="cite" fontWeight="normal">{activitie?.record_id}</Text>
                        </Text>
                        <Icon name="chevron-right" size="24px" color="gray.500" />
                    </Box>
                    <Divider borderColor="gray.300" width="100%" alignSelf="center" borderWidth="1px" marginY={2} />
                    <Text display="flex" alignItems="center" flexWrap="wrap" gap="6px" fontWeight="bold" fontSize="md">
                        Campos inválidos:{" "}
                        {activitie?.columns.map((col, index) => (
                            <Tooltip label={`Prioridade: ${formattedPriority(col?.priority)}`} aria-label="Prioridade">
                                <Text
                                    fontSize={isMobile ? "sm" : "md"}
                                    fontWeight="normal"
                                    color={getPriorityColor(col?.priority).textColor}
                                    bg={getPriorityColor(col?.priority).bgColor}
                                    textAlign="center"
                                    p={1}
                                    rounded="6px"
                                    title={`Prioridade: ${formattedPriority(col?.priority)}`}
                                >{col?.column}</Text>
                            </Tooltip>
                        ))}
                    </Text>
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