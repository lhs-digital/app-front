import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

const ModalRule = ({
  dataEdit = null,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const [listRules, setListRules] = useState([]);
  //eslint-disable-next-line
  const [permissions, setPermissions] = useState([]);
  const [rules, setRules] = useState([]);
  const [checkedRules, setCheckedRules] = useState([]);
  const [table, setTable] = useState(dataEdit?.company_table_id || 1);
  const [column, setColumn] = useState(dataEdit?.name || "");
  const [columnLabel, setColumnLabel] = useState(dataEdit?.label || "");
  const [priority, setPriority] = useState(dataEdit?.priority || "");
  //eslint-disable-next-line
  const [validations, setValidations] = useState(dataEdit?.validations || []);
  const [selectAll, setSelectAll] = useState(false);

  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState(user?.user?.company?.id);
  const [companies, setCompanies] = useState([]);

  const [ruleDetails, setRuleDetails] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany.data.data);
      } catch (error) {
        console.error("Erro ao consumir as empresas do sistema", error);
      }
    };

    if (dataEdit) {
      getData();
    }
  }, []);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    setCompanyId(event.target.value);
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allRuleIds = rules.map((rule) => rule.id);
      const newRuleDetails = {};

      allRuleIds.forEach((id) => {
        newRuleDetails[id] = ruleDetails[id] || { params: "", message: "" };
      });

      setListRules(allRuleIds);
      setCheckedRules(allRuleIds);
      setRuleDetails(newRuleDetails);
    } else {
      setListRules([]);
      setCheckedRules([]);
      setRuleDetails({});
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const responsePermissions = await api.get(`/permissions`);
        setPermissions(responsePermissions.data.data);

        const responseRules = await api.get(`/rules`);
        setRules(responseRules.data.data);
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    getData();
  }, [dataEdit]);

  const handleRuleChange = (ruleId, field, value) => {
    setRuleDetails((prev) => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        [field]: value,
      },
    }));
  };

  const saveData = async () => {
    const formattedRules = {};

    checkedRules.forEach((ruleId) => {
      formattedRules[ruleId] = {
        message: ruleDetails[ruleId]?.message || "",
        params: ruleDetails[ruleId]?.params || "",
      };
    });

    const dataToPost = {
      column: {
        name: column,
        priority: priority,
        label: columnLabel,
      },
      rules: formattedRules,
    };

    if (dataEdit.id) {
      try {
        await api.put(
          `/company_table_columns/${dataEdit.id}/update`,
          dataToPost,
        );
        toast.success("Dados editados com sucesso!");
        onClose();
        setRefresh(!refresh);
      } catch (error) {
        console.error("Erro ao editar os dados", error);
        toast.error("Erro ao editar os dados");
      }
    } else {
      try {
        await api.post(`/company_table_columns/${companyId}/rules`, dataToPost);
        toast.success("Dados salvos com sucesso!");
        onClose();
        setRefresh(!refresh);
      } catch (error) {
        console.error("Erro ao salvar os dados", error);
        toast.error("Erro ao salvar os dados");
      }
    }

    onClose();
  };

  const handleSave = () => {
    if (!table || !column || !priority || !listRules.length) {
      toast.warning(
        "Preencha os campos obrigatórios: Tabela, coluna, prioridade e regras",
      );
      return;
    }
    saveData();
  };

  const handlePermissions = (e, ruleId) => {
    if (e.target.checked) {
      setListRules((prev) => [...prev, ruleId]);
      setCheckedRules((prev) => [...prev, ruleId]);
      setRuleDetails((prev) => ({
        ...prev,
        [ruleId]: prev[ruleId] || { params: "", message: "" },
      }));
    } else {
      setListRules((prev) => prev.filter((id) => id !== ruleId));
      setCheckedRules((prev) => prev.filter((id) => id !== ruleId));
      setRuleDetails((prev) => {
        const updated = { ...prev };
        delete updated[ruleId];
        return updated;
      });
    }
  };

  useEffect(() => {
    if (!dataEdit?.validations?.length || !rules.length) return;

    const updatedRuleDetails = {};
    const updatedCheckedRules = [];
    const updatedListRules = [];

    dataEdit.validations.forEach((validation) => {
      const rule = rules.find((r) => r.name === validation.name);
      if (rule) {
        updatedRuleDetails[rule.id] = {
          params: validation.params || "",
          message: validation.message || "",
        };
        updatedCheckedRules.push(rule.id);
        updatedListRules.push(rule.id);
      }
    });

    setRuleDetails(updatedRuleDetails);
    setCheckedRules(updatedCheckedRules);
    setListRules(updatedListRules);
  }, [dataEdit, rules]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>
        {dataEdit.id
          ? "Editar coluna na auditoria"
          : "Adicionar coluna na auditoria"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        {user?.user?.role?.name === "super-admin" && (
          <Box>
            <InputLabel htmlFor="company">Empresa</InputLabel>
            <Select
              id="company"
              value={company}
              onChange={handleCompanyChange}
              fullWidth
            >
              {companies.map((companyItem) => (
                <MenuItem key={companyItem.id} value={companyItem.id}>
                  {companyItem.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
        <Box>
          <InputLabel htmlFor="table">Tabela</InputLabel>
          <Select
            id="table"
            value={table}
            disabled
            onChange={(e) => setTable(e.target.value)}
            fullWidth
          >
            <MenuItem key={1} value={1}>
              clients
            </MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel htmlFor="column">Nome da Coluna *</InputLabel>
          <TextField
            id="column"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel htmlFor="columnLabel">Label da Coluna *</InputLabel>
          <TextField
            id="columnLabel"
            value={columnLabel}
            onChange={(e) => setColumnLabel(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel htmlFor="priority">Prioridade *</InputLabel>
          <TextField
            id="priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel htmlFor="permissions" className="mb-1">
            Regras
          </InputLabel>
          <Box display="flex" flexDirection="column" gap={1}>
            <label htmlFor="selectAll">
              <Checkbox
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              Selecionar todas as regras
            </label>
            {rules.map((rule) => (
              <Box key={rule.id}>
                <label htmlFor={rule.name}>
                  <Checkbox
                    id={rule.name}
                    checked={listRules.includes(rule.id)}
                    onChange={(e) => handlePermissions(e, rule.id)}
                  />
                  {rule.name}
                  <Tooltip
                    title={rule.description || "Não contém."}
                    placement="right"
                    arrow
                  >
                    <InfoOutlined
                      fontSize="small"
                      className="ml-1 mb-0.5"
                      color="action"
                    />
                  </Tooltip>
                </label>
                {checkedRules.includes(rule.id) && (
                  <Box mt={2}>
                    <TextField
                      placeholder="Parâmetros"
                      size="small"
                      value={ruleDetails[rule.id]?.params || ""}
                      onChange={(e) =>
                        handleRuleChange(rule.id, "params", e.target.value)
                      }
                      fullWidth
                      margin="dense"
                    />
                    <TextField
                      placeholder="Mensagem"
                      size="small"
                      value={ruleDetails[rule.id]?.message || ""}
                      onChange={(e) =>
                        handleRuleChange(rule.id, "message", e.target.value)
                      }
                      fullWidth
                      margin="dense"
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          CANCELAR
        </Button>
        <Button onClick={handleSave} color="primary">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalRule;
