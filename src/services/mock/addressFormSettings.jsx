// filepath: src/services/mock/addressFormSettings.jsx

/**
 * Mock settings for testing the address section with GenericForm
 */
export const mockAddressFormSettings = {
  fields: [
    {
      name: "cep",
      label: "CEP",
      placeholder: "Digite o CEP",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "endereco",
      label: "Endereço",
      placeholder: "Digite o endereço",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "bairro",
      label: "Bairro",
      placeholder: "Digite o bairro",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "cidade",
      label: "Cidade",
      placeholder: "Digite a cidade",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "numero",
      label: "Número",
      placeholder: "Digite o número",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "complemento",
      label: "Complemento",
      placeholder: "Digite complemento (opcional)",
      type: "text",
      size: "full",
      required: false,
    },
    {
      name: "referencia",
      label: "Referência",
      placeholder: "Digite referência (opcional)",
      type: "text",
      size: "full",
      required: false,
    },
    {
      name: "moradia",
      label: "Tipo de Moradia",
      placeholder: "Digite o tipo de moradia",
      type: "text",
      size: "full",
      required: true,
    },
    {
      name: "id_conta",
      label: "Endereço de Cobrança",
      placeholder: "Digite endereço de cobrança",
      type: "text",
      size: "full",
      required: true,
    },
  ],
  defaultValues: {
    cep: "12345-678",
    endereco: "Av. Exemplo, 123",
    bairro: "Centro",
    cidade: "Minha Cidade",
    numero: "123",
    complemento: "Bloco A, Apt 101",
    referencia: "Próximo ao parque",
    moradia: "Casa",
    id_conta: "Cob123",
  },
  onSubmit: (data) => {
    console.log("Mock address form submitted:", data);
  },
};
