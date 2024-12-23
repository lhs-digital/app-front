import React, { useContext, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box,
    Flex,
} from "@chakra-ui/react"
import { AuthContext } from '../../contexts/auth';
import api from '../../services/api';
import { toast } from 'react-toastify';



const ModalReport = ({ data, dataEdit, isOpen, onClose, setRefresh, refresh }) => {
    const [createdAt, setCreatedAt] = useState([]);
    const { user, permissions } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const generateReport = async () => {
        try {
            const response = await api.get(`/report_generate/2`, {
                params: {
                    start_date: createdAt[0],
                    end_date: createdAt[1],
                },
                responseType: 'blob'
            });

            const fileBlob = new Blob([response.data], { type: response.data.type });

            const downloadUrl = URL.createObjectURL(fileBlob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'relatorio.pdf';
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            toast.success('Relatório gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar relatório', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Gerar Relatório
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl display="flex" flexDirection="column" gap={4}>
                            <Box>
                                <FormControl>
                                    <FormLabel>Período para gerar o relatório das Auditoria *</FormLabel>
                                    <Flex alignItems="center" gap="6px">
                                        <Input
                                            size="lg"
                                            placeholder='Data de Auditoria'
                                            type='date'
                                            value={createdAt[0] || ""}
                                            onChange={(e) => setCreatedAt([e.target.value, createdAt[1]])}
                                        />
                                        até
                                        <Input
                                            size="lg"
                                            placeholder='Data de Auditoria'
                                            type='date'
                                            value={createdAt[1] || ""}
                                            onChange={(e) => setCreatedAt([createdAt[0], e.target.value])}
                                        />
                                    </Flex>
                                </FormControl>
                            </Box>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter justifyContent="start">
                        <Button colorScheme="green" mr={3} onClick={generateReport}>
                            GERAR RELATÓRIO
                        </Button>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            VOLTAR
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ModalReport