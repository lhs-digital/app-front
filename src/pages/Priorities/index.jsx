/* eslint-disable */
import { Delete, Edit, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalRule from "../../components/ModalRule";
import ModalRuleDelete from "../../components/ModalRuleDelete";
import PageTitle from "../../components/PageTitle";
import SubAccordion from "../../components/Priorities/SubAccordion";
import api from "../../services/api";

const Priorities = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [lastPage, setLastPage] = useState(null);
  const [createdAt, setCreatedAt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState("");
  const [method, setMethod] = useState("");
  const [nivel, setNivel] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [filterParams, setFilterParams] = useState({
    search: "",
    method: "",
    createdAt: [],
    nivel: "",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const params = {
          search: filterParams?.search || undefined,
          method: filterParams?.method || undefined,
          nivel: filterParams?.nivel || undefined,
          created_at:
            filterParams?.createdAt && filterParams?.createdAt.length > 0
              ? [filterParams.createdAt[0], filterParams.createdAt[1]]
              : undefined,
        };

        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined),
        );

        const response = await api.get(`/company_tables?page=${currentPage}`, {
          params: filteredParams,
        });

        setCurrentPage(response.data.meta.current_page);
        setLastPage(response.data.meta.last_page);
        setData(response.data.data);
      } catch (error) {
        console.error("Erro ao verificar lista de usuários", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentPage, refresh, filterParams]);

  const handleEdit = (column) => {
    setDataEdit(column);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/company_table_columns/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Regra removida com sucesso!");
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao remover regra", error);
    }
  };

  const renderNestedAccordion = (column) => {
    return (
      <Accordion key={column.id}>
        <AccordionSummary
          id={column.id}
          aria-controls={`${column.id}-content`}
          expandIcon={<ExpandMore />}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            Coluna: {column.label}
            <div style={{ display: "flex", gap: "12px" }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(column);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(column.id);
                }}
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                  Nome
                </TableCell>
                <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                  Parâmetros
                </TableCell>
                <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                  Mensagem
                </TableCell>
                <TableCell p={0} />
                <TableCell p={0} />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} textAlign="center">
                    Não existem Regras de Auditorias no sistema
                  </TableCell>
                </TableRow>
              ) : (
                column.validations.map((validation) => (
                  <TableRow
                    key={validation.id}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                  >
                    <TableCell maxW={isMobile ? 5 : 100}>
                      {validation.rule.label}
                    </TableCell>
                    <TableCell maxW={isMobile ? 5 : 100}>
                      {validation.rule.has_params}
                    </TableCell>
                    <TableCell maxW={isMobile ? 5 : 100}>
                      {validation.message || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalRule
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
        setData={setData}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      <ModalRuleDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <PageTitle
        title="Regras de Auditorias"
        subtitle="Administração e supervisão das regras das auditorias"
        buttons={
          <Button
            variant="contained"
            color="primary"
            onClick={() => [setDataEdit({}), setIsOpen(true)]}
          >
            ADICIONAR COLUNA NA AUDITORIA
          </Button>
        }
      />
      <Accordion>
        {data.map((table) => (
          <Accordion key={table.id}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              id={table.id}
              aria-controls={`${table.id}-content`}
            >
              Tabela: {table.label}
            </AccordionSummary>
            <AccordionDetails>
              {table.columns.map((column) => (
                <SubAccordion
                  key={column.id}
                  column={column}
                  data={data}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Accordion>
    </div>
  );
};

export default Priorities;
