import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "..";

const Crm = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const { isEditing, isCreating } = useClientForm();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
            <Box className="lg:col-span-3">
                <InputLabel required>Canal de vendas</InputLabel>
                <TextField
                    type="text"
                    {...register("sales_channel", { required: "Canal de vendas é obrigatório" })}
                    fullWidth
                    error={!!errors.sales_channel}
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    helperText={errors.sales_channel?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Concorrente</InputLabel>
                <TextField
                    type="text"
                    {...register("competitor", { required: "Concorrente é obrigatório" })}
                    fullWidth
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    error={!!errors.competitor}
                    helperText={errors.competitor?.message}
                />
            </Box>
            <Box className="lg:col-span-3">
                <InputLabel required>Perfil</InputLabel>
                <TextField
                    type="text"
                    {...register("profile", { required: "Perfil é obrigatório" })}
                    fullWidth
                    error={!!errors.profile}
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    helperText={errors.profile?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Responsável</InputLabel>
                <TextField
                    type="text"
                    {...register("responsible", { required: "Responsável é obrigatório" })}
                    fullWidth
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
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
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    error={!!errors.analytical_planning}
                    helperText={errors.analytical_planning?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Condição de pagamentos</InputLabel>
                <TextField
                    type="text"
                    {...register("payment_condition", { required: "Condição de pagamentos é obrigatória" })}
                    fullWidth
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    error={!!errors.analytical_planning}
                    helperText={errors.analytical_planning?.message}
                />
            </Box>
            <Box className="lg:col-span-2">
                <InputLabel required>Vendedor padrão</InputLabel>
                <TextField
                    type="text"
                    {...register("seller", { required: "Vendedor padrão é obrigatório" })}
                    fullWidth
                    InputProps={{
                        readOnly: !isEditing && !isCreating,
                    }}
                    error={!!errors.seller}
                    helperText={errors.seller?.message}
                />
            </Box>
        </div>
    );
};

export default Crm;