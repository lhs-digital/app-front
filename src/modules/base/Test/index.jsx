import { BugReport, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import PageTitle from "../../../layout/components/PageTitle";

const TestPage = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        title="Test Page"
        icon={<BugReport />}
        buttons={[
          <Button
            key="submit-form"
            type="submit"
            variant="contained"
            startIcon={<Save />}
          >
            SALVAR
          </Button>,
        ]}
        subtitle="Page for developing components and testing features"
      />
    </div>
  );
};

export default TestPage;
