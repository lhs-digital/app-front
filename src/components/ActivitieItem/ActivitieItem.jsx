import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Grid,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  dateFormatted,
  formattedPriority,
  getPriorityColor,
} from "../../services/utils";
import ModalCheckActivitie from "../ModalCheckActivitie";
import ViewActivitie from "../ViewActivitie";

const ActivitieItem = ({ activitie, setRefresh, refresh }) => {
  const { isOpen: isDeleteOpen, onClose: onCloseDelete } = useDisclosure();
  const [dataView, setDataView] = useState(activitie);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const theme = useTheme();

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid #e2e8f0"
      borderLeft={`4px solid ${
        activitie?.status === 1
          ? theme.colors.green[500]
          : theme.colors.orange[500]
      }`}
      rounded="md"
      padding="12px"
      background="white"
      _hover={{ backgroundColor: "gray.50" }}
    >
      <Grid
        templateColumns="1fr"
        flex="1"
        cursor="pointer"
        gap={3}
        padding={0}
        margin={0}
      >
        <Box marginLeft="12px">
          <Box display="flex" justifyContent="space-between">
            <Text fontWeight="bold" fontSize="lg">
              ID do Cliente:{" "}
              <Text as="cite" fontWeight="normal">
                {activitie?.record_id}
              </Text>
            </Text>
            <Tooltip
              label={`Prioridade: ${formattedPriority(activitie?.priority)}`}
              aria-label="Prioridade"
            >
              <Text
                fontSize="lg"
                color={getPriorityColor(activitie?.priority).textColor}
                bg={getPriorityColor(activitie?.priority).bgColor}
                textAlign="center"
                shadow="sm"
                p={1}
                paddingX={2}
                rounded="6px"
                title={`Prioridade: ${formattedPriority(activitie?.priority)}`}
              >
                {" "}
                {isMobile ? "" : "Prioridade Geral:"}{" "}
                <b>{formattedPriority(activitie?.priority)}</b>
              </Text>
            </Tooltip>
          </Box>
          <Divider
            borderColor="gray.300"
            width="100%"
            alignSelf="center"
            borderWidth="1px"
            marginY={2}
          />
          {!isAccordionOpen && (
            <Text
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap="6px"
              fontWeight="bold"
              fontSize="md"
            >
              Campos inválidos{" "}
              <Text fontSize="sm" color="red.500">
                ({activitie?.columns.length})
              </Text>
              :{" "}
              {activitie?.columns.map((col, index) => (
                <Tooltip
                  key={index}
                  label={`Prioridade: ${formattedPriority(+col?.priority)}`}
                  aria-label="Prioridade"
                >
                  <Text
                    fontSize={isMobile ? "sm" : "md"}
                    fontWeight="normal"
                    color={getPriorityColor(+col?.priority).textColor}
                    bg={getPriorityColor(+col?.priority).bgColor}
                    textAlign="center"
                    p={1}
                    rounded="6px"
                    title={`Prioridade: ${formattedPriority(+col?.priority)}`}
                  >
                    {col?.label}
                  </Text>
                </Tooltip>
              ))}
            </Text>
          )}
        </Box>
        {/* accordion aqui que traga tudo do ViewActivitie*/}
        <Accordion allowToggle backgroundColor={theme.colors.gray[50]}>
          <AccordionItem border="none">
            <AccordionButton onClick={toggleAccordion}>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                Detalhes da Atividade
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <ViewActivitie
                selectedActivitie={dataView}
                setDataView={setDataView}
                id={activitie?.id}
                status={activitie?.status}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </AccordionPanel>
          </AccordionItem>
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
              <Text fontSize="sm" color="gray.500">
                Auditoria atualizada em: {dateFormatted(activitie?.updated_at)}
              </Text>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Auditorado em: {dateFormatted(activitie?.created_at)}
              </Text>
            )}
          </Box>
        </Box>
      </Grid>

      {isDeleteOpen && (
        <ModalCheckActivitie
          id={activitie?.id}
          status={activitie?.status}
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </Box>
  );
};

export default ActivitieItem;
