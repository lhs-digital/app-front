import { CreateOutlined, Save } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Tab } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PageTitle from "../../components/PageTitle";
import {
  address,
  complimentary,
  contact,
  contract,
  general,
  sale,
} from "./defaults";
import General from "./tabs/General";
const CreateClient = () => {
  const [activeTab, setActiveTab] = useState(1);
  const methods = useForm({
    defaultValues: {
      ...general,
      ...contact,
      ...complimentary,
      address,
      sale,
      contract,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <PageTitle
          title="Cadastro de cliente"
          icon={<CreateOutlined />}
          buttons={[
            <Button
              key="create-client-button"
              type="submit"
              variant="contained"
              startIcon={<Save />}
            >
              SALVAR
            </Button>,
          ]}
        />
        <TabContext value={activeTab}>
          <TabList
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            aria-label="Formulário de clientes"
          >
            <Tab label="Informações gerais" value={1} />
            <Tab label="Endereço" value={2} />
            <Tab label="Contato" value={3} />
            <Tab label="CRM" value={4} />
            <Tab label="Complementar" value={5} />
            <Tab label="Contrato" value={6} />
            <Tab label="Documentação" value={7} />
          </TabList>
          <TabPanel value={1} sx={{ padding: 0 }}>
            <General />
          </TabPanel>
          <TabPanel value={2} sx={{ padding: 0 }}>
            teste
          </TabPanel>
          <TabPanel value={3} sx={{ padding: 0 }}>
            teste
          </TabPanel>
          <TabPanel value={4} sx={{ padding: 0 }}>
            teste
          </TabPanel>
          <TabPanel value={5} sx={{ padding: 0 }}>
            teste
          </TabPanel>
          <TabPanel value={6} sx={{ padding: 0 }}>
            teste
          </TabPanel>
          <TabPanel value={7} sx={{ padding: 0 }}>
            teste
          </TabPanel>
        </TabContext>
      </form>
    </FormProvider>
  );
};

export default CreateClient;
