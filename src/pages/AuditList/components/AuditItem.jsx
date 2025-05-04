import {
  ContentPaste,
  ContentPasteGo,
  Info,
  KeyboardArrowDown,
  OpenInNew,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  colors,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import WorkOrderForm from "../../../components/WorkOrderForm";
import { useThemeMode } from "../../../contexts/themeModeContext";
import { useUserState } from "../../../hooks/useUserState";
import {
  dateFormatted,
  formattedPriority,
  getPriorityColor,
} from "../../../services/utils";
import { handleMode } from "../../../theme";
import ViewAuditItem from "./ViewAuditItem";

const AuditItem = ({
  auditRecord,
  setRefresh,
  refresh,
  onClick = () => {},
}) => {
  const [dataView, setDataView] = useState(auditRecord);
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { permissions } = useUserState().state;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="1px solid #e2e8f0"
      borderRadius="8px"
      gap={2}
      padding="24px 16px 16px 16px"
      position="relative"
      overflow="clip"
    >
      <div
        className="absolute h-[8px] left-0 right-0 top-0"
        style={{
          backgroundColor:
            auditRecord?.status === 1
              ? theme === "light"
                ? colors.green[100]
                : colors.green[600]
              : theme === "light"
                ? colors.orange[100]
                : colors.orange[500],
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        gap={2}
      >
        <p className="text-lg">
          ID do Cliente: <span>{auditRecord?.record_id}</span>
        </p>
        <Box display="flex" gap={2}>
          <Tooltip
            title={`Prioridade: ${formattedPriority(auditRecord?.priority, theme)}`}
            aria-label="Prioridade"
          >
            <Chip
              size="large"
              sx={getPriorityColor(auditRecord?.priority, theme)}
              label={
                <div>
                  {isMobile ? "" : "Prioridade Geral:"}{" "}
                  <b>{formattedPriority(auditRecord?.priority, theme)}</b>
                </div>
              }
            />
          </Tooltip>
          {permissions.some((per) => per.name === "update_tasks") &&
            (auditRecord?.status === 0 ? (
              <Tooltip
                title={auditRecord?.work_order ? "Ver O.S." : "Abrir O.S."}
                aria-label="Abrir O.S."
              >
                <button
                  onClick={onClick}
                  className="p-2 aspect-square rounded-full flex flex-col items-center justify-center"
                  style={getPriorityColor(auditRecord?.priority, theme)}
                >
                  {auditRecord?.work_order ? (
                    <OpenInNew fontSize="small" />
                  ) : (
                    <ContentPasteGo fontSize="small" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Informação" aria-label="Informação">
                <button
                  onClick={onClick}
                  className="p-2 aspect-square rounded-full flex flex-col items-center justify-center"
                  style={{
                    color:
                      theme === "light" ? colors.green[600] : colors.green[100],
                    backgroundColor:
                      theme === "light" ? colors.green[100] : colors.green[600],
                  }}
                >
                  <Info fontSize="small" />
                </button>
              </Tooltip>
            ))}
        </Box>
      </Box>
      <Divider
        sx={{
          borderColor:
            handleMode(themeMode) === "light" ? "grey.300" : "grey.700",
          width: "100%",
          alignSelf: "center",
          borderWidth: "1px",
        }}
      />
      {!isAccordionOpen && (
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm">
            Campos inválidos{" "}
            <span
              style={{
                color: theme === "light" ? colors.red[500] : colors.red[400],
              }}
            >
              ({auditRecord?.columns.length})
            </span>
            :{" "}
          </p>
          {auditRecord?.columns.slice(0, 2).map((col, index) => (
            <Chip
              key={index}
              size="small"
              variant="outlined"
              label={col?.label}
              sx={{
                color: getPriorityColor(col?.priority, theme).color,
              }}
            />
          ))}
          {auditRecord?.columns.length > 2 && (
            <Tooltip
              title={auditRecord?.columns
                .slice(2)
                .map((col) => col?.label)
                .join(", ")}
              aria-label="Mais campos"
            >
              <div className="flex flex-col items-center justify-center bg-neutral-300 dark:bg-neutral-700 aspect-square rounded-full px-1 text-xs">
                <p className="mr-0.5">+{auditRecord?.columns.length - 2}</p>
              </div>
            </Tooltip>
          )}
        </div>
      )}
      <Accordion
        expanded={isAccordionOpen}
        onChange={toggleAccordion}
        variant="outlined"
        className="!rounded-lg overflow-clip"
      >
        <AccordionSummary expandIcon={<KeyboardArrowDown />}>
          Detalhes
        </AccordionSummary>
        <AccordionDetails>
          <ViewAuditItem
            selectedActivitie={dataView}
            setDataView={setDataView}
            id={auditRecord?.id}
            status={auditRecord?.status}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </AccordionDetails>
      </Accordion>
      {auditRecord?.work_order && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <ContentPaste fontSize="2rem" />
            <p>Ordem de Serviço</p>
          </div>
          <div className="border p-2.5 rounded-lg border-[--border]">
            <WorkOrderForm assignment={auditRecord?.work_order} compact />
          </div>
        </div>
      )}
      <Box
        textAlign="right"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        marginLeft="auto"
      >
        <Box>
          {auditRecord?.status === 1 ? (
            <Typography variant="body2" color="textSecondary">
              Corrigido em: {dateFormatted(auditRecord?.updated_at)}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Auditado em: {dateFormatted(auditRecord?.created_at)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AuditItem;
