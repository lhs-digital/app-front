import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEntityForm } from "./EntityFormContext";
import GenericInput from "./GenericInput";

const GenericForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("0");
  const {
    formSettings,
    isEditing,
    setIsEditing,
    isCreating,
    entity,
    id,
    resetAuditErrors,
    recordId,
    status,
    table,
  } = useEntityForm();

  const methods = useForm();

  const handleSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);
      toast.success("Dados salvos com sucesso!");

      if (table) {
        navigate(`/tabelas/${table}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar os dados");
    }
  };

  const renderFields = (fields) => {
    return fields.map((field, index) => {
      return (
        <GenericInput
          key={`field-${index}-${field.name}`}
          size={field.size || "grow"}
          {...field}
        />
      );
    });
  };

  const renderTabs = () => {
    return (
      <TabContext value={activeTab}>
        <TabList
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {formSettings.tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} value={`${index}`} />
          ))}
        </TabList>
        {formSettings.tabs.map((tab, index) => (
          <TabPanel key={index} value={`${index}`} sx={{ paddingX: 0 }}>
            <div className="grid grid-cols-12 gap-4">
              {renderFields(tab.fields)}
            </div>
          </TabPanel>
        ))}
      </TabContext>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="w-full">
        {formSettings && renderFields(formSettings.fields || [])}
      </form>
    </FormProvider>
  );
};

export default GenericForm;
