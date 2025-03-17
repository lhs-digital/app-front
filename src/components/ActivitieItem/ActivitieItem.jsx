import { Build, Info, KeyboardArrowDown } from "@mui/icons-material";
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
import { useThemeMode } from "../../contexts/themeModeContext";
import { useUserState } from "../../hooks/useUserState";
import {
  dateFormatted,
  formattedPriority,
  getPriorityColor,
} from "../../services/utils";
import { handleMode } from "../../theme";
import ModalFormClient from "../ModalFormClient";
import ViewActivitie from "../ViewActivitie";

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
  const [dataView, setDataView] = useState(activitie);
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { permissions } = useUserState().state;
  const [isOpen, setIsOpen] = useState(false);

  const handleView = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
            activitie?.status === 1
              ? theme === "light"
                ? colors.green[100]
                : colors.green[600]
              : theme === "light"
                ? colors.orange[100]
                : colors.orange[500],
        }}
      />
      <ModalFormClient
        isOpen={isOpen}
        onClose={handleClose}
        selectedActivitie={dataView}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        gap={2}
      >
        <p className="text-lg">
          ID do Cliente: <span>{activitie?.record_id}</span>
        </p>
        <Box display="flex" gap={2}>
          <Tooltip
            title={`Prioridade: ${formattedPriority(activitie?.priority, theme)}`}
            aria-label="Prioridade"
          >
            <Chip
              size="large"
              sx={getPriorityColor(activitie?.priority, theme)}
              label={
                <div>
                  {isMobile ? "" : "Prioridade Geral:"}{" "}
                  <b>{formattedPriority(activitie?.priority, theme)}</b>
                </div>
              }
            />
          </Tooltip>
          {permissions.some((per) => per.name === "update_tasks") &&
            (activitie?.status === 0 ? (
              <Tooltip title="Corrigir" aria-label="Corrigir">
                <button
                  onClick={handleView}
                  className="p-2 aspect-square rounded-full flex flex-col items-center justify-center"
                  style={getPriorityColor(activitie?.priority, theme)}
                >
                  <Build fontSize="small" />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Informação" aria-label="Informação">
                <button
                  onClick={handleView}
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
              ({activitie?.columns.length})
            </span>
            :{" "}
          </p>
          {activitie?.columns.slice(0, 2).map((col, index) => (
            <Chip
              key={index}
              size="small"
              variant="outlined"
              label={col?.label}
              sx={{
                color: getPriorityColor(col?.priority, theme).color,
              }}
            >
              <p className="text-sm">&quot;{col?.label}&quot;</p>
            </Chip>
          ))}
          {activitie?.columns.length > 2 && (
            <Tooltip
              title={activitie?.columns
                .slice(2)
                .map((col) => col?.label)
                .join(", ")}
              aria-label="Mais campos"
            >
              <div className="flex flex-col items-center justify-center bg-neutral-300 dark:bg-neutral-700 aspect-square rounded-full px-1 text-xs">
                <p className="mr-0.5">+{activitie?.columns.length - 2}</p>
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
          <ViewActivitie
            selectedActivitie={dataView}
            setDataView={setDataView}
            id={activitie?.id}
            status={activitie?.status}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </AccordionDetails>
      </Accordion>
      <Box
        textAlign="right"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        marginLeft="auto"
      >
        <Box>
          {activitie?.status === 1 ? (
            <Typography variant="body2" color="textSecondary">
              Corrigido em: {dateFormatted(activitie?.updated_at)}
              {console.log(activitie)}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Auditado em: {dateFormatted(activitie?.created_at)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ActivitieItem;
