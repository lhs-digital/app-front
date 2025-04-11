import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const ModalRule = ({ dataEdit, isOpen, onClose, setRefresh }) => {
  const [listRules, setListRules] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [permissions, setPermissions] = useState([]);
  const [rules, setRules] = useState([]);
  const [checkedRules, setCheckedRules] = useState([]);
  const [column, setColumn] = useState("");
  const [columnLabel, setColumnLabel] = useState("");
  const [priority, setPriority] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [validations, setValidations] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [rulesLoaded, setRulesLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [ruleDetails, setRuleDetails] = useState({});
  const user = useAuthUser();
  const [company, setCompany] = useState("");
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState("");

  useEffect(() => {
    if (dataEdit && isOpen) {
      setCompany(dataEdit.companyId);
      setTable(dataEdit.company_table_id);
      setColumn(dataEdit.name);
      setColumnLabel(dataEdit.label);
      setPriority(dataEdit.priority);
      setValidations(dataEdit.validations);
    } else {
      setCompany("");
      setTable("");
      setColumn("");
      setColumnLabel("");
      setPriority(null);
      setValidations([]);
      setSelectAll(false);
    }
  }, [dataEdit, isOpen]);

  useEffect(() => {
    if (company) {
      tablesFromCompany(company);
    }
  }, [company]);

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
        setRulesLoaded(true);

        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany?.data?.data);

      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    getData();
  }, [dataEdit]);

  useEffect(() => {
    if (!dataEdit?.validations?.length || !rules.length) return;

    const updatedRuleDetails = {};
    const updatedCheckedRules = [];
    const updatedListRules = [];

    dataEdit?.validations.forEach((validation) => {
      const rule = rules?.find((r) => r.name === validation.rule.name);

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

  const handleRuleChange = (ruleId, field, value) => {
    setRuleDetails((prev) => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        [field]: value,
      },
    }));
  };

  const tablesFromCompany = async (companyId) => {
    try {
      const response = await api.get(`company_tables/all_tables?company_id=${companyId}`);
      setTables(response?.data?.data);
    } catch (error) {
      console.error("Erro ao acessar as roles por empresa", error);
    }
  };

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    tablesFromCompany(event.target.value);
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
        company_table_id: table,
        name: column,
        priority: priority,
        label: columnLabel,
      },
      rules: formattedRules,
    };

    if (dataEdit?.id) {
      try {
        await api.put(
          `/company_table_columns/${dataEdit?.id}/update`,
          dataToPost,
        );
        toast.success("Dados editados com sucesso!");
        setRefresh((prev) => !prev);

      } catch (error) {
        console.error("Erro ao editar os dados", error);
        toast.error("Erro ao editar os dados");
      }
    } else {
      try {
      await api.post(`/company_table_columns/${table}/rules`, dataToPost);
        toast.success("Dados salvos com sucesso!");
        setRefresh((prev) => !prev);

      } catch (error) {
        console.error("Erro ao salvar os dados", error);

        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
          return;
        }
      }
    }
  };

  const handleSave = () => {
    if (!column || priority === null || listRules.length === 0 || !table || !company) {
      toast.warning(
        "Preencha os campos obrigatórios: Tabela, coluna, prioridade e regras",
      );
      return;
    }
    saveData();

    cleanFields();

    onClose();
  };

  const handlePermissions = (e, ruleId) => {
    let updatedCheckedRules;
    if (e.target.checked) {
      updatedCheckedRules = [...checkedRules, ruleId];
    } else {
      updatedCheckedRules = checkedRules.filter((id) => id !== ruleId);
    }
    setCheckedRules(updatedCheckedRules);
    setListRules(updatedCheckedRules);
    setRuleDetails((prev) => {
      const updated = { ...prev };
      if (e.target.checked) {
        updated[ruleId] = prev[ruleId] || { params: "", message: "" };
      } else {
        delete updated[ruleId];
      }
      return updated;
    });
    setSelectAll(updatedCheckedRules.length === rules.length);
  };

  const cleanFields = () => {
    setColumn("");
    setColumnLabel("");
    setPriority("");
    setCompany("");
    setTable("");
    setSelectAll(false);
    setListRules([]);
    setCheckedRules([]);
    setRuleDetails({});

  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        cleanFields();
        onClose();
      }}
      fullWidth
    >
      <DialogTitle>
        {dataEdit?.id
          ? "Editar coluna na auditoria"
          : "Adicionar coluna na auditoria"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">

        <Box>
          <InputLabel>Empresa *</InputLabel>
          <Select
            placeholder="Selecione uma opção"
            value={user.isLighthouse ? company : user.company.id}
            onChange={handleCompanyChange}
            disabled={!user.isLighthouse}
            fullWidth
          >
            {companies.map((companyItem) => (
              <MenuItem key={companyItem.id} value={companyItem.id}>
                {companyItem.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <InputLabel htmlFor="table">Tabela</InputLabel>
          <Select id="table" value={table} onChange={(e) => setTable(e.target.value)} fullWidth>
            {tables.length === 0 ? (
              <MenuItem disabled>Não existem tabelas na empresa</MenuItem>
            ) : (
              tables.map((tableItem) => (
                <MenuItem key={tableItem.id} value={tableItem.id}>
                  {tableItem.name}
                </MenuItem>
              ))
            )}
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
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          >
            <MenuItem value={1}>Alta</MenuItem>
            <MenuItem value={2}>Moderada</MenuItem>
            <MenuItem value={3}>Baixa</MenuItem>
          </Select>
        </Box>
        <FormGroup className="flex flex-col gap-4">
          <FormLabel htmlFor="permissions" className="mb-1">
            Regras
          </FormLabel>
          <FormControlLabel
            checked={selectAll}
            onChange={handleSelectAll}
            control={<Checkbox id="selectAll" />}
            label={"Selecionar todas as regras"}
          />
          {rules.map((rule) => (
            <Box key={rule.id}>
              <FormControlLabel
                checked={listRules.includes(rule.id)}
                onChange={(e) => handlePermissions(e, rule.id)}
                control={<Checkbox id={rule.name} />}
                label={rule.label}
              />
              <FormHelperText>{rule.description}</FormHelperText>
              {checkedRules.includes(rule.id) && (
                <Box mt={2}>
                  {rule?.has_params !== 0 && (
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
                  )}
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
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            cleanFields();
            onClose();
          }}
          color="info"
        >
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