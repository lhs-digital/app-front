import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formattedPriority, getPriorityColor } from "../../services/utils";
import ModalFormClient from "../ModalFormClient";

const ViewActivitie = ({
  id,
  status,
  selectedActivitie,
  setRefresh,
  refresh,
}) => {
  //eslint-disable-next-line
  const formattedDate = (date) => new Date(date).toLocaleDateString("pt-BR");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleView = () => {
    onOpen();
  };

  //eslint-disable-next-line
  const handleConfirm = async () => {
    try {
      await api.put(`/auditing/${id}/toggle_status`);
      toast.success("Status da atividade alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar o status da atividade", error);
    } finally {
      setRefresh(!refresh);
    }
  };

  return (
    <Box
      width="100%"
      maxWidth="800px"
      gap="12px"
      flexDirection="column"
      display="flex"
    >
      <Table
        variant="striped"
        size="sm"
        width="100%"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Thead bg="gray.100">
          <Tr>
            <Th>Campo</Th>
            <Th>Sugestão</Th>
            <Th>Prioridade</Th>
          </Tr>
        </Thead>
        <Tbody>
          {selectedActivitie?.columns.map((col, index) => (
            <Tr key={index}>
              <Td fontWeight="bold">{col?.label}</Td>
              <Td>{col?.message || "N/A"}</Td>
              <Td>
                <Tooltip
                  label={`Prioridade: ${formattedPriority(+col?.priority)}`}
                  aria-label="Prioridade"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={getPriorityColor(+col?.priority).textColor}
                    bg={getPriorityColor(+col?.priority).bgColor}
                    p={1}
                    rounded="md"
                    textAlign="center"
                  >
                    {formattedPriority(+col?.priority)}
                  </Text>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* <Box ><b>Auditoria foi realizada em:</b> {formattedDate(selectedActivitie?.created_at)} </Box>
            <Box ><b>Auditoria foi atualizada em:</b> {formattedDate(selectedActivitie?.updated_at)} </Box> */}
      <Box marginTop={4} display="flex" justifyContent="flex-end">
        <Button
          colorScheme={status === 1 ? "orange" : "green"}
          onClick={handleView}
        >
          Corrigir Erros
        </Button>
      </Box>

      {isOpen && (
        <ModalFormClient
          isOpen={isOpen}
          onClose={onClose}
          selectedActivitie={selectedActivitie}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </Box>
  );
};

export default ViewActivitie;
