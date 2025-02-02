import { Build, KeyboardArrowDown } from "@mui/icons-material";
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
import {
  dateFormatted,
  formattedPriority,
  getPriorityColor,
} from "../../services/utils";
import ModalCheckActivitie from "../ModalCheckActivitie";
import ModalFormClient from "../ModalFormClient";
import ViewActivitie from "../ViewActivitie";

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dataView, setDataView] = useState(activitie);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      bgcolor="white"
      position="relative"
      overflow="clip"
    >
      <div
        className="absolute h-[8px] left-0 right-0 top-0"
        style={{
          backgroundColor:
            activitie?.status === 1 ? colors.green[100] : colors.orange[100],
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
            title={`Prioridade: ${formattedPriority(activitie?.priority)}`}
            aria-label="Prioridade"
          >
            <Chip
              size="large"
              sx={getPriorityColor(activitie?.priority)}
              label={
                <div>
                  {isMobile ? "" : "Prioridade Geral:"}{" "}
                  <b>{formattedPriority(activitie?.priority)}</b>
                </div>
              }
            />
          </Tooltip>
          <Tooltip title="Corrigir" aria-label="Corrigir">
            <button
              onClick={handleView}
              className="p-2 aspect-square rounded-full flex flex-col items-center justify-center"
              style={getPriorityColor(activitie?.priority)}
            >
              <Build fontSize="small" />
            </button>
          </Tooltip>
        </Box>
      </Box>
      <Divider
        sx={{
          borderColor: "gray.300",
          width: "100%",
          alignSelf: "center",
          borderWidth: "1px",
        }}
      />
      {!isAccordionOpen && (
        <div className="flex flex-row items-center gap-2">
          <p className="text-sm">
            Campos inválidos{" "}
            <span style={{ color: colors.red[500] }}>
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
                color: getPriorityColor(col?.priority).color,
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
              <div className="flex flex-col items-center justify-center bg-neutral-300 aspect-square rounded-full px-1 text-xs">
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
          {activitie?.status === true ? (
            <Typography variant="body2" color="textSecondary">
              Auditoria atualizada em: {dateFormatted(activitie?.updated_at)}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Auditorado em: {dateFormatted(activitie?.created_at)}
            </Typography>
          )}
        </Box>
      </Box>
      {isDeleteOpen && (
        <ModalCheckActivitie
          id={activitie?.id}
          status={activitie?.status}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </Box>
  );
};

export default ActivitieItem;
