import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

const ModalReport = ({ isOpen, onClose }) => {
  const [createdAt, setCreatedAt] = useState([]);
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState(user?.user?.company?.id);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany.data.data);
      } catch (error) {
        console.error("Erro ao consumir as empresas do sistema", error);
      }
    };
    getData();
  }, []);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    setCompanyId(event.target.value);
  };

  const generateReport = async () => {
    try {
      const response = await api.get(`/report_generate`, {
        params: {
          company_id: companyId,
          start_date: createdAt[0],
          end_date: createdAt[1],
        },
        responseType: "blob",
      });

      const fileBlob = new Blob([response.data], { type: response.data.type });

      const downloadUrl = URL.createObjectURL(fileBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "relatorio.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gerar Relatório</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl display="flex" flexDirection="column" gap={4}>
              <Box>
                <FormControl>
                  {user?.user?.role?.name === "super-admin" && (
                    <Box mb={3}>
                      <FormLabel htmlFor="company">Empresa</FormLabel>
                      <Select
                        id="company"
                        placeholder="Selecione uma opção"
                        value={company}
                        onChange={handleCompanyChange}
                      >
                        {companies.map((companyItem) => (
                          <option key={companyItem.id} value={companyItem.id}>
                            {companyItem.name}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  )}

                  <FormLabel>
                    Período para gerar o relatório das Auditoria *
                  </FormLabel>
                  <Flex alignItems="center" gap="6px">
                    <Input
                      size="lg"
                      placeholder="Data de Auditoria"
                      type="date"
                      value={createdAt[0] || ""}
                      onChange={(e) =>
                        setCreatedAt([e.target.value, createdAt[1]])
                      }
                    />
                    até
                    <Input
                      size="lg"
                      placeholder="Data de Auditoria"
                      type="date"
                      value={createdAt[1] || ""}
                      onChange={(e) =>
                        setCreatedAt([createdAt[0], e.target.value])
                      }
                    />
                  </Flex>
                </FormControl>
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="end">
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              VOLTAR
            </Button>
            <Button colorScheme="green" onClick={generateReport}>
              GERAR RELATÓRIO
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalReport;
