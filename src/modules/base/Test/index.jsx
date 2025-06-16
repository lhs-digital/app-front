import { Web } from "@mui/icons-material";
import PageTitle from "../../../layout/components/PageTitle";

const TestPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title="Desenvolvimento"
        icon={<Web />}
        subtitle="Esta página é destinada para testes e desenvolvimento"
      />
    </div>
  );
};

export default TestPage;
