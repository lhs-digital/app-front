import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import { ModuleReport } from "../reports/ModuleReport";

const ReportViewer = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Gerar Relatório</DialogTitle>
    <DialogContent>
      <PDFViewer>
        <ModuleReport />
      </PDFViewer>
    </DialogContent>
  </Dialog>
);

export default ReportViewer;
