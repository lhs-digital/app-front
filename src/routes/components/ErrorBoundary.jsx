import { BugReportOutlined, ContentCopy } from "@mui/icons-material";
import { Button, Divider, Tooltip } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 px-4 py-16 max-h-screen overflow-hidden">
        <div className="flex flex-col w-1/2 gap-4">
          <h1 className="font-bold text-xl">
            <span className="mr-2 mb-0.5">
              <BugReportOutlined />
            </span>
            A aplicação se comportou de forma inesperada.
          </h1>
          <h2>
            Entre em contato com o suporte e mande um{" "}
            <Tooltip
              arrow
              title="Procure por uma tecla que contenha algo como PrtScn, Print ou Imprimir"
            >
              <span className="underline font-medium cursor-pointer">
                print
              </span>
            </Tooltip>{" "}
            dessa tela junto com as mensagens de erro aqui contidas.
          </h2>
        </div>
        <Divider className="w-1/2" />
        <div className="flex flex-col gap-4 w-1/2 px-6 grow overflow-y-scroll relative">
          <p className="font-semibold">{error.message}</p>
          <code>{error.stack}</code>
        </div>
        <Divider className="w-1/2" />
        <Button
          onClick={() => navigator.clipboard.writeText(error.stack)}
          startIcon={<ContentCopy />}
          variant="contained"
        >
          Copiar Stack Trace
        </Button>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
