import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

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
    <div className="relative bg-black flex flex-col items-center justify-center h-screen gap-8">
      <div className="absolute login-bg top-0 left-0 w-screen h-screen opacity-40 grayscale" />
      <form
        onSubmit={handleSubmit}
        className="z-20 bg-[--background-color] shadow-lg shadow-white/50 flex flex-col gap-4 w-[95vw] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 border p-8 rounded-lg"
      >
        <h1 className="text-2xl">Recuperar Senha</h1>
        <p>
          Um código de recuperação de senha será enviado ao seu email, caso
          esteja cadastrado no sistema.
        </p>
        <TextField
          type="email"
          placeholder="Insira o seu email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" fullWidth type="submit">
          Enviar Código
        </Button>
        <Link to="/" className="mt-4 text-center">
          Já possui uma conta? Acessar
        </Link>
      </form>
      <div className="absolute bottom-2 text-xs text-white">
        &copy; {new Date().getFullYear()} Lighthouse
      </div>
    </div>
  );
};

export default RecoverPassword;
