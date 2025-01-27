export const formattedPriority = (priority) => {
    switch (priority) {
        case 1:
            return "Baixa";
        case 2:
            return "Moderada";
        case 3:
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
            return { textColor: 'red.600', bgColor: 'red.100' };
        default:
            return { textColor: 'black', bgColor: 'gray.300' };
    }
};

export const dateFormatted = (date) => new Date(date).toLocaleDateString('pt-BR');

export const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export const validarCPF = (cpf) => {
    const apenasNumeros = cpf.replace(/\D/g, '');
    
    const regex = /^\d{11}$/;
    return regex.test(apenasNumeros);
}


export const validarCNPJ = (cnpj) => {
    const apenasNumeros = cnpj.replace(/\D/g, '');

    const regex = /^\d{14}$/;
    return regex.test(apenasNumeros);
}

export const validarDataNascimento = (data) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false; 
    const hoje = new Date();
    const nascimento = new Date(data);
    const idadeMinima = 18;

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= idadeMinima;
};
