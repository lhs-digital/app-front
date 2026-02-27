import { Masonry } from "@mui/lab";
import { Box, CircularProgress, colors } from "@mui/material";
import { useState } from "react";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import { useAuditFilters } from "../../../../hooks/useAuditFilters";
import { useCompany } from "../../../../hooks/useCompany";
import { handleMode, themeColors } from "../../../../theme";
import CreateTask from "../../../base/WorkOrder/components/CreateTask";
import AuditItem from "./AuditItem";
import { useNavigate } from "react-router-dom";

const AuditContent = ({ isLoading, data, handleView }) => {
  const theme = handleMode(useThemeMode().mode);
  const { filters } = useAuditFilters();
  const { company } = useCompany();
  const [openWorkOrder, setOpenWorkOrder] = useState(false);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState(null);
  const navigate = useNavigate();
  if (!company) {
    return (
      <div className="p-8 lg:py-12">
        <p className="text-lg text-center text-zinc-500">
          Selecione uma empresa para visualizar as atividades.
        </p>
      </div>
    );
  }

  if (!filters.moduleId) {
    return (
      <div className="p-8 lg:py-12">
        <p className="text-lg text-center text-zinc-500">
          Selecione uma tabela para visualizar as atividades.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-80 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="p-8 lg:py-12">
        <p className="text-lg text-center text-zinc-500">
          Não há atividades pendentes ou concluídas.
        </p>
      </div>
    );
  }

  const handleWorkOrderClick = (auditRecord) => {
    navigate(`/ordens-de-servico/${auditRecord?.work_order?.id}`);
  };

  return (
    <>
      <Box width="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="end"
          width={"100%"}
          gap={2}
          border="1px solid"
          borderBottom="none"
          borderColor="divider"
          borderRadius="8px 8px 0 0"
          p={2}
        >
          <Box display="flex" alignItems="center" alignSelf="end" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                width="12px"
                height="12px"
                borderRadius="30%"
                bgcolor={themeColors[theme].warning.main}
              />
              <p className="text-sm">Atividade Pendente</p>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                width="12px"
                height="12px"
                borderRadius="30%"
                bgcolor={themeColors[theme].success.main}
              />
              <p className="text-sm">Atividade Concluída</p>
            </Box>
          </Box>
        </Box>
        <Box
          className="w-full flex flex-col items-center lg:min-h-80"
          border="1px solid"
          borderColor="divider"
          borderRadius="0 0 8px 8px"
          p={2}
          py={3}
          backgroundColor={theme === "light" ? colors.grey[50] : "#0f0f0f"}
        >
          <Masonry
            columns={{
              xs: 1,
              lg: 2,
              xl: 3,
            }}
            spacing={2}
            className="m-0"
            width="100%"
          >
            {data.map((item) => (
              <AuditItem
                key={item.id}
                auditRecord={item}
                onViewClick={() => handleView(item)}
                onWorkOrderClick={() => handleWorkOrderClick(item)}
              />
            ))}
          </Masonry>
        </Box>
      </Box>
      <CreateTask
        open={openWorkOrder}
        onClose={() => setOpenWorkOrder(false)}
        auditRecord={selectedAuditRecord}
      />
    </>
  );
};

export default AuditContent;
