/* eslint-disable */
import { Add } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import AddRule from "./AddRule";
import CompanySelector from "./CompanySelector";

const AuditRules = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [company, setCompany] = useState("");
  const [table, setTable] = useState("");
  const { permissions, isLighthouse } = useUserState().state;

  const [filterParams, setFilterParams] = useState({
    search: "",
    method: "",
    createdAt: [],
    nivel: "",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

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

      const response = await api.get(`/company_tables?page=${currentPage}`, {
        params: filteredParams,
      });
      console.log("tables", response.data.data);
      return response.data.data;
    },
  });

  const handleEdit = (column, companyId) => {
    setDataEdit({ ...column, companyId });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
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
        <CompanySelector company={company} setCompany={setCompany} />
      )}
    </div>
  );
};

export default AuditRules;
