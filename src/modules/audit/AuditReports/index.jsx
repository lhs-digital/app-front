import { Box, Button } from "@mui/material";
import { useState } from "react";
import ModalReport from "../../../components/ModalReport";
import PageTitle from "../../../layout/components/PageTitle";
import { useUserState } from "../../../hooks/useUserState";

const AuditReports = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { permissions } = useUserState().state;

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
            <Button marginBottom="6px" onClick={() => setIsOpen(true)}>
              GERAR RELATÓRIO
            </Button>
          ) : null}
        </Box>
      </Box>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AuditReports;
