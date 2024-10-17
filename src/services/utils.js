export const formattedPriority = (priority) => {
    switch (priority) {
        case 1:
            return "Muito Baixa";
        case 2:
            return "Baixa";
        case 3:
            return "Média";
        case 4:
            return "Alta";
        case 5:
            return "Urgente";
        default:
            return "Muito Baixa"
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 1:
            return { textColor: 'gray.600', bgColor: 'gray.100' };
        case 2:
            return { textColor: 'blue.600', bgColor: 'blue.100' };
        case 3:
            return { textColor: 'yellow.600', bgColor: 'yellow.100' };
        case 4:
            return { textColor: 'orange.600', bgColor: 'orange.100' };
        case 5:
            return { textColor: 'red.600', bgColor: 'red.100' };
        default:
            return { textColor: 'black', bgColor: 'gray.300' };
    }
};

export const dateFormatted = (date) => new Date(date).toLocaleDateString('pt-BR');