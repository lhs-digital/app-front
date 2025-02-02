import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import ModalReport from "../../components/ModalReport";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";

const ReportsAud = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [refresh, setRefresh] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(null);

  const { permissions } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        title="Relatórios de Auditorias"
        subtitle="Administração e gerenciamento dos relatórios das auditorias"
      />

      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        fontSize="20px"
        mt="20px"
        gap="24px"
        width="100%"
        px={2}
      >
        <Box maxW={800} w="100%" py={4} px={2}>
          {permissions.some(
            (permissions) => permissions.name === "report_generate",
          ) ? (
            <Button
              colorScheme="blue"
              marginBottom="6px"
              onClick={() => setIsOpen(true)}
            >
              GERAR RELATÓRIO
            </Button>
          ) : null}
        </Box>
      </Box>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ReportsAud;
