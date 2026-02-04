import { Home, SearchOff } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 px-4 py-16 max-h-screen overflow-hidden">
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        {/* Icon and Status Code */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-8xl font-bold text-primary dark:text-primary-light">
            404
          </div>
          <div className="flex items-center gap-3">
            <SearchOff sx={{ fontSize: 48 }} className="text-neutral-400" />
            <h1 className="font-bold text-3xl text-center">
              Página não encontrada
            </h1>
          </div>
        </div>

        <Divider className="w-full" />

        {/* Description */}
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-lg text-neutral-600 dark:text-neutral-400">
            A página que você está procurando não existe ou foi movida.
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Verifique o endereço digitado ou retorne à página inicial.
          </p>
        </div>

        <Divider className="w-full" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/")}
            fullWidth
          >
            Voltar para o início
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)} fullWidth>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
