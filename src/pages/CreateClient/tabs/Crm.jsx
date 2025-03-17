import { Box, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const Crm = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
            <Box className="lg:col-span-2">
                <InputLabel required>Canal de vendas</InputLabel>
                <Select
                    {...register("sales_channel", { required: "Canal de vendas é obrigatório" })}
                    fullWidth
                    error={!!errors.sales_channel}
                >
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="loja_fisica">Loja Física</MenuItem>
                    <MenuItem value="telefone">Telefone</MenuItem>
                    <MenuItem value="outros">Outros</MenuItem>
                </Select>
                {errors.sales_channel && <FormHelperText error>{errors.sales_channel.message}</FormHelperText>}
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Concorrente</InputLabel>
                <TextField
                    type="text"
                    {...register("competitor", { required: "Concorrente é obrigatório" })}
                    fullWidth
                    error={!!errors.competitor}
                    helperText={errors.competitor?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Perfil</InputLabel>
                <Select
                    {...register("profile", { required: "Perfil é obrigatório" })}
                    fullWidth
                    error={!!errors.profile}
                >
                    <MenuItem value="residencial">Residencial</MenuItem>
                    <MenuItem value="comercial">Comercial</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="outros">Outros</MenuItem>
                </Select>
                {errors.profile && <FormHelperText error>{errors.profile.message}</FormHelperText>}
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Responsável</InputLabel>
                <TextField
                    type="text"
                    {...register("responsible", { required: "Responsável é obrigatório" })}
                    fullWidth
                    error={!!errors.responsible}
                    helperText={errors.responsible?.message}
                />
            </Box>

            <Box className="lg:col-span-2">
                <InputLabel required>Planejamento analítico</InputLabel>
                <TextField
                    type="text"
                    {...register("analytical_planning", { required: "Planejamento analítico é obrigatório" })}
                    fullWidth
                    error={!!errors.analytical_planning}
                    helperText={errors.analytical_planning?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Condição de pagamentos</InputLabel>
                <Select
                    {...register("payment_condition", { required: "Condição de pagamentos é obrigatória" })}
                    fullWidth
                    error={!!errors.payment_condition}
                >
                    <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
                    <MenuItem value="boleto">Boleto</MenuItem>
                    <MenuItem value="transferencia">Transferência</MenuItem>
                    <MenuItem value="outros">Outros</MenuItem>
                </Select>
                {errors.payment_condition && <FormHelperText error>{errors.payment_condition.message}</FormHelperText>}
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Vendedor padrão</InputLabel>
                <TextField
                    type="text"
                    {...register("seller", { required: "Vendedor padrão é obrigatório" })}
                    fullWidth
                    error={!!errors.seller}
                    helperText={errors.seller?.message}
                />
            </Box>
        </div>
    );
};

export default Crm;