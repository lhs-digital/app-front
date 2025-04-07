import Validation from "./Validation";

const column = {
  id: 1,
  name: "numero",
  label: "Numero da residência",
  company_table_id: 1,
  priority: 1,
  validations: [
    {
      id: 1,
      table_column_id: 1,
      rule: {
        name: "required",
        label: "Obrigatório",
        description: "Campo obrigatório",
        has_params: 0,
      },
      params: "",
      message: "Este campo é obrigatório.",
    },
    {
      id: 2,
      table_column_id: 1,
      rule: {
        name: "not_in",
        label: "Não está incluso",
        description:
          "Selecione os valores que não serão aceitos por essa regra.",
        has_params: 1,
      },
      params: "0",
      message: "O valor informado não é permitido.",
    },
  ],
};

const Rule = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">{column.label}</h2>
      <div className="flex flex-row gap-4">
        {column.validations.map((validation) => (
          <Validation
            key={validation.id}
            rule={validation.rule}
            params={validation.params}
          />
        ))}
      </div>
    </div>
  );
};

export default Rule;
