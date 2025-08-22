import { Masonry } from "@mui/lab";
import { Box, CircularProgress, colors } from "@mui/material";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import { useAuditFilters } from "../../../../hooks/useAuditFilters";
import { useCompany } from "../../../../hooks/useCompany";
import { getPriorityColor, priorities } from "../../../../services/utils";
import { handleMode } from "../../../../theme";
import AuditItem from "./AuditItem";

const AuditContent = ({ isLoading, data, handleView }) => {
  const theme = handleMode(useThemeMode().mode);
  const { filters } = useAuditFilters();
  const { company } = useCompany();

  if (!company) {
    return (
      <div className="p-8 lg:py-12">
        <p className="text-lg text-center text-gray-500">
          Selecione uma empresa para visualizar as atividades.
        </p>
      </div>
    );
  }

  if (!filters.moduleId) {
    return (
      <div className="p-8 lg:py-12">
        <p className="text-lg text-center text-gray-500">
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
        <p className="text-lg text-center text-gray-500">
          Não há atividades pendentes ou concluídas.
        </p>
      </div>
    );
  }

  return (
    <Box width="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
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
              bgcolor={colors.orange[theme === "light" ? 100 : 500]}
            />
            <p className="text-sm">Atividade Pendente</p>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width="12px"
              height="12px"
              borderRadius="30%"
              bgcolor={colors.green[theme === "light" ? 100 : 500]}
            />
            <p className="text-sm">Atividade Concluída</p>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" alignSelf="end" gap={2}>
          {priorities.map((item) => (
            <Box key={item.label} display="flex" alignItems="center" gap={1}>
              <Box
                width="12px"
                height="12px"
                borderRadius="30%"
                sx={{
                  backgroundColor: getPriorityColor(item.value, theme)[
                    theme === "light" ? "color" : "backgroundColor"
                  ],
                }}
              />
              <p className="text-sm">Prioridade {item.label}</p>
            </Box>
          ))}
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
              onClick={() => handleView(item)}
            />
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default AuditContent;
