import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import api from "../../services/api";
import { clientForm } from "../../services/mock/clientForm";

const EntityFormContext = createContext();

export const EntityFormProvider = ({ children }) => {
  const { table, id } = useParams();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const recordId = location.state?.recordId;
  const errorColumns = location.state?.columns;
  const status = location.state?.status;
  const { company } = useCompany();
  const isCreating = id === "novo";

  console.log("EntityFormProvider", table, id, isCreating);

  const [auditErrors, setAuditErrors] = useState(() => {
    if (status === 1) {
      return {};
    }
    return errorColumns
      ? errorColumns.reduce((acc, column) => {
          acc[column.name] = {
            message: column.message,
          };
          return acc;
        }, {})
      : {};
  });

  const resetAuditErrors = () => {
    setAuditErrors({});
  };

  const { data: entity } = useQuery({
    queryKey: ["entity", table, id],
    queryFn: async () => {
      const response = await api.get(`/module/${table}/${id}`, {
        params: {
          company_id: company.id,
        },
      });
      return response.data.data;
    },
    enabled: !isCreating && !!id && !!table,
  });

  const formSettings = clientForm;

  return (
    <EntityFormContext.Provider
      value={{
        formSettings,
        isEditing,
        isCreating,
        setIsEditing,
        auditErrors,
        resetAuditErrors,
        status,
        recordId,
        entity,
        id,
        table,
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
