import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import api from "../../services/api";

const EntityFormContext = createContext();

export const EntityFormProvider = ({ children }) => {
  const { module, id } = useParams();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const recordId = location.state?.recordId;
  const columns = location.state?.columns;
  const status = location.state?.status;
  const { company } = useCompany();
  const isCreating = id === "novo";
  const [auditErrors, setAuditErrors] = useState({});
  const [auditValues, setAuditValues] = useState({});

  useEffect(() => {
    if (status === 0) {
      const errors = {};
      const values = {};
      for (const column of columns || []) {
        errors[column.name] = column.message;
        values[column.name] = column.value;
      }
      setAuditErrors(errors);
      setAuditValues(values);
    }
  }, [columns, status]);

  const { data: formSettings } = useQuery({
    queryKey: ["entity", module, id],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/modules/${module}/forms`,
      );
      return response.data.data.forms;
    },
  });

  const resetAuditErrors = () => {
    setAuditErrors({});
  };

  // const { data: entity } = useQuery({
  //   queryKey: ["entity", module, id],
  //   queryFn: async () => {
  //     const response = await api.get(`/module/${module}/${id}`, {
  //       params: {
  //         company_id: company.id,
  //       },
  //     });
  //     return response.data.data;
  //   },
  //   enabled: !isCreating && !!id && !!module,
  // });

  return (
    <EntityFormContext.Provider
      value={{
        formSettings,
        isEditing,
        isCreating,
        setIsEditing,
        values: auditValues,
        errors: auditErrors,
        resetAuditErrors,
        status,
        recordId,
        id,
        module,
      }}
    >
      {children}
    </EntityFormContext.Provider>
  );
};

export const useEntityForm = () => {
  const context = useContext(EntityFormContext);
  if (context === undefined) {
    throw new Error("useEntityForm must be used within a EntityFormProvider");
  }

  return context;
};

export default EntityFormContext;
