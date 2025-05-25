import { Add, Delete, Edit, RuleFolder } from "@mui/icons-material";
import {
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalDelete from "../../../components/ModalDelete";
import { useThemeMode } from "../../../contexts/themeModeContext";
import { useCompany } from "../../../hooks/useCompany";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import { getPriorityColor, severityLabels } from "../../../services/utils";
import { handleMode } from "../../../theme";
import AddRule from "./components/AddRule";
import ContextSelect from "./components/ContextSelect";
import Validation from "./components/Validation";

const AuditRules = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const { company } = useCompany();
  const [deleteId, setDeleteId] = useState(null);
  const [table, setTable] = useState("");
  const { permissions } = useUserState().state;
  const [totalCount, setTotalCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 5,
  });
  const [filterParams, setFilterParams] = useState({
    search: "",
    method: "",
    createdAt: [],
    nivel: "",
  });
  // const isMobile = useMediaQuery("(max-width: 768px)");
  const theme = handleMode(useThemeMode().mode);

  const { data } = useQuery({
    queryKey: ["company_tables", pagination.page, filterParams],
    queryFn: async () => {
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
        // eslint-disable-next-line no-unused-vars
        Object.entries(params).filter(([_, v]) => v !== undefined),
      );

      const response = await api.get(`/company_tables`, {
        params: {
          ...filteredParams,
          page: pagination.page,
          company_id: company.id,
        },
      });
      console.log("tables", response.data.data);
      setTable(response.data.data[0]?.id);
      updateTableData(pagination.page, pagination.rowsPerPage);
      return response.data.data;
    },
    enabled: company !== "" && table !== "",
  });

  const updateTableData = (page = 1, rows = pagination.rowsPerPage) => {
    if (!data) return;
    const currentTable = data.find((t) => t.id === table);
    if (currentTable) {
      const startIndex = (page - 1) * rows;
      const endIndex = startIndex + rows;
      setTableData(currentTable.columns.slice(startIndex, endIndex));
      setTotalCount(currentTable.columns.length);
      setPagination((prev) => ({
        ...prev,
        page,
      }));
    }
  };

  const handleEdit = (column) => {
    setDataEdit({ ...column, company_table_id: table });
    setIsOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setTableData(
      data
        .filter((t) => t.id === table)[0]
        .columns.slice(
          pagination.rowsPerPage * newPage,
          pagination.rowsPerPage * (newPage + 1),
        ),
    );
    setPagination({
      ...pagination,
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setTableData(
      data
        .filter((t) => t.id === table)[0]
        .columns.slice(0, parseInt(event.target.value, 10)),
    );
    setPagination({
      ...pagination,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  const { mutate: addRule } = useMutation({
    mutationFn: async (data) => {
      await api.post(`/company_table_columns/${table}/rules`, data);
    },
    onSuccess: () => {
      toast.success("Regra adicionada com sucesso");
      setIsOpen(false);
      qc.invalidateQueries(["company_tables"]);
      updateTableData();
    },
    onError: (error) => {
      toast.error("Erro ao adicionar regra");
      console.error("Erro ao adicionar regra", error);
    },
  });

  const { mutate: updateRule } = useMutation({
    mutationFn: async (data) => {
      await api.put(`/company_table_columns/${data.id}/update`, data);
    },
    onSuccess: () => {
      toast.success("Regra atualizada com sucesso");
      setIsOpen(false);
      setDataEdit({});
      qc.invalidateQueries(["company_tables"]);
      updateTableData();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar regra");
      console.error("Erro ao atualizar regra", error);
    },
  });

  const { mutate: removeRule } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/company_table_columns/${id}`);
    },
    onSuccess: () => {
      toast.success("Regra removida com sucesso");
      setDeleteId(null);
      qc.invalidateQueries(["company_tables"]);
      updateTableData();
    },
    onError: (error) => {
      toast.error("Erro ao remover regra");
      console.error("Erro ao remover regra", error);
    },
  });

  const renderPriority = (priority) => {
    const { backgroundColor, color } = getPriorityColor(priority, theme);
    const label = severityLabels[priority];
    return (
      <Chip
        label={label}
        style={{ backgroundColor, color }}
        className="text-xs"
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: `${backgroundColor} !important`,
          color: `${color} !important`,
          "&.MuiChip-outlined": {
            borderColor: `${backgroundColor} !important`,
          },
        }}
      />
    );
  };

  const renderWarning = () => {
    if (!company && !table) {
      return (
        <p className="text-sm text-gray-400">
          Selecione uma empresa e uma tabela para ver as regras de auditoria.
        </p>
      );
    }

    if (!company) {
      return <p className="text-sm text-gray-400">Selecione uma empresa</p>;
    }

    if (!table) {
      return (
        <p className="text-sm text-gray-400">
          Selecione uma tabela para ver as regras de auditoria.
        </p>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalDelete
        isOpen={!!deleteId}
        onClose={() => setDeleteId("")}
        content={
          <p>
            Você tem certeza que deseja excluir esta coluna? Ela parará de ser
            auditada.
          </p>
        }
        onConfirm={() => removeRule(deleteId)}
      />
      <AddRule
        open={isOpen}
        data={dataEdit}
        onClose={() => setIsOpen(false)}
        submit={dataEdit?.id ? updateRule : addRule}
      />
      <PageTitle
        title="Regras de Auditoria"
        icon={<RuleFolder />}
        subtitle="Administração e supervisão das regras das auditorias"
        buttons={
          permissions.some((per) => per.name === "define_rules") && (
            <Button
              key="add-rule"
              variant="contained"
              color="primary"
              disabled={!company || !table}
              onClick={() => [setDataEdit({}), setIsOpen(true)]}
              startIcon={<Add />}
            >
              NOVA REGRA
            </Button>
          )
        }
      />
      <ContextSelect company={company} table={table} setTable={setTable} />
      {renderWarning()}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coluna</TableCell>
              <TableCell>Regras</TableCell>
              <TableCell>Prioridade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((column) => (
              <TableRow key={column.id}>
                <TableCell>{column.label}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    {column.validations.map((v) => (
                      <Validation
                        key={`${v.id}-${column.name}`}
                        rule={v.rule}
                        params={v.params}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{renderPriority(column.priority)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(column);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteId(column.id);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </TableContainer>
    </div>
  );
};

export default AuditRules;
