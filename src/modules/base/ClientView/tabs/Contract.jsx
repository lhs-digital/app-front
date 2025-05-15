import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "../index";

const Contract = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { auditErrors } = useClientForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-4">
        <InputLabel required>Plano de vendas</InputLabel>
        <TextField
          type="text"
          {...register("sales_plan", {
            required: "Plano de vendas é obrigatório",
          })}
          fullWidth
          error={!!auditErrors.sales_plan || !!errors.sales_plan}
          helperText={
            auditErrors.sales_plan?.message ?? errors.sales_plan?.message
          }
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Tipo de cobrança</InputLabel>
        <TextField
          type="text"
          {...register("billing_type", {
            required: "Tipo de cobrança é obrigatório",
          })}
          fullWidth
          error={!!auditErrors.billing_type || !!errors.billing_type}
          helperText={
            auditErrors.billing_type?.message ?? errors.billing_type?.message
          }
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Modelo para impressão</InputLabel>
        <TextField
          type="text"
          {...register("model", {
            required: "Modelo para impressão é obrigatório",
          })}
          fullWidth
          error={!!auditErrors.model || !!errors.model}
          helperText={auditErrors.model?.message ?? errors.model?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Assinatura digital</InputLabel>
        <TextField
          type="text"
          {...register("signature", {
            required: "Assinatura digital é obrigatória",
          })}
          fullWidth
          error={!!auditErrors.signature || !!errors.signature}
          helperText={
            auditErrors.signature?.message ?? errors.signature?.message
          }
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Filial</InputLabel>
        <TextField
          type="text"
          {...register("branch", { required: "Filial é obrigatória" })}
          fullWidth
          error={!!auditErrors.branch || !!errors.branch}
          helperText={auditErrors.branch?.message ?? errors.branch?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Indicado através</InputLabel>
        <TextField
          type="text"
          {...register("indication", { required: "Indicação é obrigatória" })}
          fullWidth
          error={!!auditErrors.indication || !!errors.indication}
          helperText={
            auditErrors.indication?.message ?? errors.indication?.message
          }
        />
      </Box>

      <Box className="lg:col-span-8">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Faturamento</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Tipo de documento fatura</InputLabel>
                <TextField
                  type="text"
                  {...register("invoice_document_type", {
                    required: "Tipo de documento fatura é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.invoice_document_type ||
                    !!errors.invoice_document_type
                  }
                  helperText={
                    auditErrors.invoice_document_type?.message ??
                    errors.invoice_document_type?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Carteira de cobrança</InputLabel>
                <TextField
                  type="text"
                  {...register("billing_wallet", {
                    required: "Carteira de cobrança é obrigatória",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.billing_wallet || !!errors.billing_wallet
                  }
                  helperText={
                    auditErrors.billing_wallet?.message ??
                    errors.billing_wallet?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Vendedor</InputLabel>
                <TextField
                  type="text"
                  {...register("seller", {
                    required: "Vendedor é obrigatório",
                  })}
                  fullWidth
                  error={!!auditErrors.seller || !!errors.seller}
                  helperText={
                    auditErrors.seller?.message ?? errors.seller?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Gera financeiro automático</InputLabel>
                <Select
                  {...register("automatic", {
                    required: "Gera financeiro automático é obrigatório",
                  })}
                  fullWidth
                  error={!!auditErrors.automatic || !!errors.automatic}
                >
                  <MenuItem value="Sim">Sim</MenuItem>
                  <MenuItem value="Não">Não</MenuItem>
                </Select>
                {errors.automatic && (
                  <FormHelperText error>
                    {errors.automatic.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel>ID Contrato principal</InputLabel>
                <TextField
                  type="text"
                  {...register("main_contract_id", {
                    required: "ID Contrato principal é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.main_contract_id || !!errors.main_contract_id
                  }
                  helperText={
                    auditErrors.main_contract_id?.message ??
                    errors.main_contract_id?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Tipo de Documento Opcional</InputLabel>
                <TextField
                  type="text"
                  {...register("optional_document_type", {
                    required: "Tipo de Documento Opcional é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.optional_document_type ||
                    !!errors.optional_document_type
                  }
                  helperText={
                    auditErrors.optional_document_type?.message ??
                    errors.optional_document_type?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Tipo de Documento Opcional 2</InputLabel>
                <TextField
                  type="text"
                  {...register("optional_document_type_2", {
                    required: "Tipo de Documento Opcional 2 é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.optional_document_type_2 ||
                    !!errors.optional_document_type_2
                  }
                  helperText={
                    auditErrors.optional_document_type_2?.message ??
                    errors.optional_document_type_2?.message
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="lg:col-span-8">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Taxa de Ativação</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Tipo de documento</InputLabel>
                <TextField
                  type="text"
                  {...register("activation_document_type", {
                    required: "Tipo de documento é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.activation_document_type ||
                    !!errors.activation_document_type
                  }
                  helperText={
                    auditErrors.activation_document_type?.message ??
                    errors.activation_document_type?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Produto</InputLabel>
                <TextField
                  type="text"
                  {...register("product", {
                    required: "Produto é obrigatório",
                  })}
                  fullWidth
                  error={!!auditErrors.product || !!errors.product}
                  helperText={
                    auditErrors.product?.message ?? errors.product?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Taxa de ativação</InputLabel>
                <TextField
                  type="text"
                  {...register("activation_fee", {
                    required: "Taxa de ativação é obrigatória",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.activation_fee || !!errors.activation_fee
                  }
                  helperText={
                    auditErrors.activation_fee?.message ??
                    errors.activation_fee?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Condição de pagamento</InputLabel>
                <TextField
                  type="text"
                  {...register("payment_condition", {
                    required: "Condição de pagamento é obrigatória",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.payment_condition ||
                    !!errors.payment_condition
                  }
                  helperText={
                    auditErrors.payment_condition?.message ??
                    errors.payment_condition?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Vendedor ativação</InputLabel>
                <TextField
                  type="text"
                  {...register("activation_seller", {
                    required: "Vendedor ativação é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.activation_seller ||
                    !!errors.activation_seller
                  }
                  helperText={
                    auditErrors.activation_seller?.message ??
                    errors.activation_seller?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Fidelidade</InputLabel>
                <TextField
                  type="text"
                  {...register("loyalty", {
                    required: "Fidelidade é obrigatória",
                  })}
                  fullWidth
                  error={!!auditErrors.loyalty || !!errors.loyalty}
                  helperText={
                    auditErrors.loyalty?.message ?? errors.loyalty?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Desconto fidelidade</InputLabel>
                <TextField
                  type="text"
                  {...register("loyalty_discount", {
                    required: "Desconto fidelidade é obrigatório",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.loyalty_discount || !!errors.loyalty_discount
                  }
                  helperText={
                    auditErrors.loyalty_discount?.message ??
                    errors.loyalty_discount?.message
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <InputLabel required>Taxa de visita improdutiva</InputLabel>
                <TextField
                  type="text"
                  {...register("unproductive_visit_fee", {
                    required: "Taxa de visita improdutiva é obrigatória",
                  })}
                  fullWidth
                  error={
                    !!auditErrors.unproductive_visit_fee ||
                    !!errors.unproductive_visit_fee
                  }
                  helperText={
                    auditErrors.unproductive_visit_fee?.message ??
                    errors.unproductive_visit_fee?.message
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
};

export default Contract;
