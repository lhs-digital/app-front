import {
  Add,
  CenterFocusStrong,
  Close,
  InfoOutlined,
  Widgets,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper } from "react-zoom-pan-pinch";
import Diagram from "../../../components/ERDiagram/Diagram";
import { parseStructure } from "../../../components/ERDiagram/erUtility";
import PageTitle from "../../../layout/components/PageTitle";
import dbSchema from "../../../services/mock/dbSchema.json";

const CompanyModules = () => {
  const data = parseStructure(dbSchema.structure);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const navigate = useNavigate();

  const handleSelectTable = (table) => {
    navigate(`/modulos/${table.name}/criar`, {
      state: {
        table,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title="Módulos"
        icon={<Widgets />}
        subtitle="Veja a estrutura do banco de dados e gerencie os módulos do sistema"
        buttons={[
          <Button
            key="create-module"
            variant="contained"
            color={isCreatingModule ? "error" : "primary"}
            startIcon={isCreatingModule ? <Close /> : <Add />}
            onClick={() => {
              setIsCreatingModule(!isCreatingModule);
            }}
          >
            {isCreatingModule ? "Cancelar" : "Criar módulo"}
          </Button>,
        ]}
      />
      <TransformWrapper
        limitToBounds={false}
        initialPositionX={150}
        initialPositionY={150}
        initialScale={0.75}
        minScale={0.5}
        maxScale={1.5}
        wrapperStyle={{ width: "100%", height: "100%" }}
        centerZoomed
        className="relative"
      >
        {({ zoomIn, zoomOut, centerView }) => (
          <div className="flex flex-col gap-4">
            <div className="p-1 flex flex-row justify-between gap-2 border border-[--border] rounded-lg">
              <div className="flex flex-row gap-4">
                <Button
                  color="primary"
                  size="small"
                  onClick={() => {
                    centerView();
                  }}
                  startIcon={<CenterFocusStrong />}
                >
                  Centralizar
                </Button>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => {
                    zoomIn();
                  }}
                  startIcon={<ZoomIn />}
                >
                  Aumentar
                </Button>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => {
                    zoomOut();
                  }}
                  startIcon={<ZoomOut />}
                >
                  Diminuir
                </Button>
              </div>
              <AnimatePresence>
                {isCreatingModule && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-row gap-2 items-center pr-4"
                  >
                    <InfoOutlined fontSize="small" />
                    Clique em uma tabela destacada para criar um módulo.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-full h-[62.5vh] overflow-y-hidden border border-[--border] rounded-lg grid-bg relative">
              <Diagram
                data={data}
                allowHover={isCreatingModule}
                onSelectTable={handleSelectTable}
              />
            </div>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};

export default CompanyModules;
