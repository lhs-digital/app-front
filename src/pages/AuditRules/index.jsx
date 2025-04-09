/* eslint-disable */
import { Add, Delete, Edit } from "@mui/icons-material";
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
  useMediaQuery,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle";
import { useThemeMode } from "../../contexts/themeModeContext";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import { getPriorityColor, severityLabels } from "../../services/utils";
import { handleMode } from "../../theme";
import AddRule from "./AddRule";
import CompanySelector from "./CompanySelector";
import Validation from "./Validation";

const AuditRules = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [company, setCompany] = useState("");
  const [table, setTable] = useState("");
  const { permissions, isLighthouse } = useUserState().state;
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const theme = handleMode(useThemeMode().mode);

  const { data } = useQuery({
    queryKey: ["company_tables", currentPage, filterParams],
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
        Object.entries(params).filter(([_, v]) => v !== undefined),
      );

      const response = await api.get(`/company_tables`, {
        params: { ...filteredParams, page: currentPage, company_id: company },
      });
      console.log("tables", response.data.data);
      return response.data.data;
    },
    enabled: company !== "" && table !== "",
  });

  useEffect(() => {
    if (data) {
      const currentTable = data.filter((t) => t.name === table)[0];
      if (currentTable) {
        const rows = currentTable.columns.slice(
          pagination.rowsPerPage * (currentPage - 1),
          pagination.rowsPerPage * currentPage,
        );
        setTotalCount(currentTable.columns.length);
        setTableData(rows);
      }
    }
  }, [data, table]);

  const handleEdit = (column, companyId) => {
    setDataEdit({ ...column, companyId });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setTableData(
      data
        .filter((t) => t.name === table)[0]
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
        .filter((t) => t.name === table)[0]
        .columns.slice(0, parseInt(event.target.value, 10)),
    );
    setPagination({
      ...pagination,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  const { mutate: removeRule } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/company_table_columns/${id}`);
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

  return (
    <div className="flex flex-col gap-6 w-full">
      <AddRule open={isOpen} onClose={() => setIsOpen(false)} />
      <PageTitle
        title="Regras de Auditoria"
        subtitle="Administração e supervisão das regras das auditorias"
        buttons={
          permissions.some((per) => per.name === "define_rules") && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => [setDataEdit({}), setIsOpen(true)]}
              startIcon={<Add />}
            >
              NOVA REGRA
            </Button>
          )
        }
      />
      {isLighthouse && (
        <CompanySelector
          company={company}
          setCompany={setCompany}
          table={table}
          setTable={setTable}
        />
      )}
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
                      <Validation rule={v.rule} params={v.params} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{renderPriority(column.priority)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
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
