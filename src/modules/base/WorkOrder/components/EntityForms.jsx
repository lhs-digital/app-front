const AuditForm = ({ data }) => {
  return (
    <div>
      <h2 className="font-medium">Tarefa de auditoria</h2>
    </div>
  );
};

export const entityForms = (entityType, data) => {
  switch (entityType) {
    case "audit_invalid_record":
      return <AuditForm data={data} />;
    case "audit_work_order":
      return <AuditForm data={data} />;
    default:
      return (
        <div>
          <p className="text-center">
            Não temos suporte para esta entidade ainda.
          </p>
          <p>Tipo: {entityType}</p>
          <p>{JSON.stringify(data)}</p>
        </div>
      );
  }
};
