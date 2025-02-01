import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { Select } from "@chakra-ui/react";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  validarCNPJ,
  validarCPF,
  validarDataNascimento,
  validarEmail,
} from "../../services/utils";

const ModalClient = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const [email, setEmail] = useState(dataEdit?.email || "");
  const [numero, setNumero] = useState(dataEdit?.numero || "");
  const [tipoPessoa, setTipoPessoa] = useState(dataEdit?.tipo_pessoa || "");
  const [whatsapp, setWhatsapp] = useState(dataEdit?.whatsapp || "");
  const [dataNascimento, setDataNascimento] = useState(
    dataEdit?.data_nascimento || "",
  );
  const [cnpjCpf, setCnpjCpf] = useState(dataEdit?.cnpj_cpf || "");
  const [referencia, setReferencia] = useState(dataEdit?.referencia || "");
  const [contribuenteIcms, setContribuenteIcms] = useState(
    dataEdit?.contribuinte_icms || "",
  );

  const saveData = async () => {
    try {
      await api.post("/clients", {
        numero: numero,
        email: email,
        tipo_pessoa: tipoPessoa,
        whatsapp: whatsapp,
        data_nascimento: dataNascimento,
        cnpj_cpf: cnpjCpf,
        referencia: referencia,
        contribuinte_icms: contribuenteIcms,
      });

      setRefresh(!refresh);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    }
  };

  const updateUser = async () => {
    try {
      await api.put(`/clients/${dataEdit.id}`, {
        numero: numero,
        email: email,
        tipo_pessoa: tipoPessoa,
        whatsapp: whatsapp,
        data_nascimento: dataNascimento,
        cnpj_cpf: cnpjCpf,
        referencia: referencia,
        contribuinte_icms: contribuenteIcms,
      });

      setRefresh(!refresh);
      toast.success("Usuário editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar usuário", error);
    }
  };

  const handleSave = () => {
    if (
      !email ||
      !numero ||
      !tipoPessoa ||
      !whatsapp ||
      !dataNascimento ||
      !cnpjCpf ||
      !referencia ||
      !contribuenteIcms
    ) {
      toast.warning("Preencha os campos obrigatórios!");
      return;
    }

    if (emailAlreadyExists()) {
      toast.warning("E-mail já cadastrado!");
      return;
    }

    if (!validarEmail(email)) {
      toast.warning("E-mail inválido");
      return;
    }

    if (!validarDataNascimento(dataNascimento)) {
      toast.warning(
        "Data de nascimento inválida. O cliente deve ser maior de 18 anos.",
      );
      return;
    }

    if (tipoPessoa === "F" && !validarCPF(cnpjCpf)) {
      toast.warning("CPF inválido");
      return;
    }

    if (tipoPessoa === "J" && !validarCNPJ(cnpjCpf)) {
      toast.warning("CNPJ inválido");
      return;
    }

    if (dataEdit?.id) {
      updateUser();
    } else {
      saveData();
    }

    onClose();
  };

  const emailAlreadyExists = () => {
    if (dataEdit.email !== email && data?.length) {
      return data.find((item) => item.email === email);
    }

    return false;
  };

  // Função de mascarar whatsapp (82) 99999-9999
  const maskWhatsapp = (value) => {
    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, "");
    // Adiciona parênteses para o DDD
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    // Adiciona traço para o número
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  // Função de mascarar cnpj ou cpf de acordo com o tipo de pessoa
  const maskCnpjCpf = (value) => {
    value = value.replace(/\D/g, "");
    if (tipoPessoa === "F") {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (tipoPessoa === "J") {
      value = value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }
    return value;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {dataEdit.id
              ? `Editar Cliente com ID: ${dataEdit?.id}`
              : "Cadastrar Cliente"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl display="flex" flexDirection="column" gap={4}>
              <Box>
                <FormLabel>E-mail *</FormLabel>
                <Input
                  type="text"
                  value={email}
                  disabled={dataEdit?.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Número *</FormLabel>
                <Input
                  type="number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Tipo de Pessoa *</FormLabel>
                <Select
                  placeholder="Selecione uma opção"
                  value={tipoPessoa}
                  onChange={(e) => setTipoPessoa(e.target.value)}
                >
                  <option value="F">Física</option>
                  <option value="J">Jurídica</option>
                </Select>
              </Box>
              <Box>
                <FormLabel>Whatsapp *</FormLabel>
                <Input
                  type="text"
                  value={whatsapp}
                  maxLength={15}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Data de Nascimento *</FormLabel>
                <Input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>CNPJ/CPF *</FormLabel>
                <Input
                  type="text"
                  value={cnpjCpf}
                  maxLength={tipoPessoa === "F" ? 14 : 18}
                  onChange={(e) => setCnpjCpf(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Referência *</FormLabel>
                <Input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Contribuinte ICMS *</FormLabel>
                <Select
                  placeholder="Selecione uma opção"
                  value={contribuenteIcms}
                  onChange={(e) => setContribuenteIcms(e.target.value)}
                >
                  <option value={1}>Sim</option>
                  <option value={0}>Não</option>
                </Select>
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="end">
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              CANCELAR
            </Button>
            <Button colorScheme="green" onClick={handleSave}>
              SALVAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalClient;
