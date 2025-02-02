import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/Logo_1.svg";
import api from "../../services/api";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Preencha o email para que o código seja enviado!");
      return;
    }

    try {
      const response = await api.post(`/password-email`, { email });

      if (response.data.status !== "error") {
        toast.success("Código de recuperação enviado com sucesso!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error("Email não cadastrado no sistema!");
      }
    } catch (error) {
      console.error("Recuperação de senha falhou:", error);
      throw error;
    }
  };

  return (
    <div className="container-center">
      <div className="login">
        <img src={logo} alt="Logo do App Provedores" />
        <div className="login-area">
          <h1>App Provedores</h1>
          <p>Sistema de Gerenciamento de Provedores</p>
        </div>

        <form onSubmit={handleSubmit}>
          <p>
            Um código de recuperação de senha será enviado ao seu email, caso
            esteja cadastrado no sistema.
          </p>
          <input
            type="email"
            placeholder="Insira o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Enviar Código</button>
        </form>

        <Link to="/">Já possui uma conta? Acessar</Link>
      </div>
    </div>
  );
};

export default RecoverPassword;
