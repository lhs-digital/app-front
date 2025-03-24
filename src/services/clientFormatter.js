export const formatClient = (client) => {
  return {
    razao: client.name,
    fantasia: client.fantasy_name,
    tipo_pessoa: client.type,
    tipo_cliente_scm: client.client_type,
    id_tipo_cliente: client.subscriber_type,
    cnpj_cpf: client.cpf,
    ie_identidade: client.ie_rg,
    contribuinte_icms: client.icms_contributor || false,
    nacionalidade: client.nationality,
    data_nascimento: client.birth_date,
    ativo: client.active || true,
    sexo: client.sex,
    tipo_assinante: client.subscriber_type,
    profissao: client.profession,
    filial_id: client.branch || 0,
    cep: client.zip_code,
    endereco: client.street,
    numero: client.number,
    complemento: client.complement,
    bairro: client.neighborhood,
    cidade: client.city,
    referencia: client.reference,
    moradia: client.housing_type,
    id_conta: client.billing_address,
    telefone_celular: client.mobile,
    whatsapp: client.whatsapp,
    email: client.email,
    id_campanha: client.sales_channel,
    id_concorrente: client.competitor,
    id_perfil: client.profile,
    responsavel: client.responsible,
    id_vendedor: client.seller,
    cond_pagamento: client.payment_condition,
    nome_pai: client.father_name,
    nome_mae: client.mother_name,
  };
};

export const formatClientBack = (client) => {
  const general = {
    name: client.razao,
    fantasy_name: client.fantasia,
    type: client.tipo_pessoa,
    client_type: client.tipo_cliente_scm,
    cpf: client.cnpj_cpf,
    ie_rg: client.ie_identidade,
    icms_contributor: client.contribuinte_icms,
    nationality: client.nacionalidade,
    birth_date: client.data_nascimento,
    active: client.ativo,
    sex: client.sexo,
    subscriber_type: client.tipo_assinante,
    profession: client.profissao,
    branch: client.filial_id,
  };

  const address = {
    zip_code: client.cep,
    street: client.endereco,
    number: client.numero,
    complement: client.complemento,
    neighborhood: client.bairro,
    city: client.cidade,
    reference: client.referencia,
    housing_type: client.moradia,
    billing_address: client.id_conta,
  };

  const contact = {
    mobile: client.telefone_celular,
    whatsapp: client.whatsapp,
    email: client.email,
  };

  const sale = {
    sales_channel: client.id_campanha,
    competitor: client.id_concorrente,
    profile: client.id_perfil,
    responsible: client.responsavel,
    seller: client.id_vendedor,
    payment_condition: client.cond_pagamento,
  };

  const complimentary = {
    father_name: client.nome_pai,
    mother_name: client.nome_mae,
  };

  return {
    general,
    address,
    contact,
    sale,
    complimentary,
  };
};
