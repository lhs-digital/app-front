import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import Header from "../../components/Header";
import ModalReport from "../../components/ModalReport";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";

const ReportsAud = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [refresh, setRefresh] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(null);

  const { permissions } = useContext(AuthContext);

  return (
    <>
      <Header />

      <Title
        title="Relatórios de Auditorias"
        subtitle="Administração e gerenciamento dos relatórios das auditorias"
      />

      <Flex
        align="center"
        justify="center"
        flexDirection="column"
        fontSize="20px"
        fontFamily="poppins"
      >
        <Box maxW={800} w="100%" py={4} px={2}>
          {permissions.some(
            (permissions) => permissions.name === "report_generate",
          ) ? (
            <Button
              colorScheme="blue"
              marginBottom="6px"
              onClick={() => onOpen()}
            >
              GERAR RELATÓRIO
            </Button>
          ) : null}
        </Box>
      </Flex>

      {isOpen && <ModalReport isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default ReportsAud;
