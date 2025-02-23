import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // const response = await api.get(`/password-reset/${token}`);

        // if (response.data.token !== token) {
        //   navigate("/");
        // }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        navigate("/");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      toast.warning("Preencha os campos para definir uma nova senha!");
      return;
    }

    if (password.length < 8) {
      toast.warning("A senha deve conter no mínimo 8 caracteres!");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.warning("Senhas não conferem!");
      return;
    }

    try {
      await api.post(`/password-update`, {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success("Senha alterada com sucesso!");

      navigate("/");
    } catch (error) {
      toast.error("Erro ao tentar alterar a senha");
    }
  };

  return (
    <div className="relative bg-black flex flex-col items-center justify-center h-screen gap-8">
      <div className="absolute login-bg top-0 left-0 w-screen h-screen opacity-40 grayscale" />
      <form
        onSubmit={handleSubmit}
        className="z-20 bg-white shadow-lg shadow-white/50 flex flex-col gap-4 w-[95vw] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 border p-8 rounded-lg"
      >
        <h1 className="text-2xl">Nova Senha</h1>
        <p>Preencha e confirme sua nova senha</p>
        <TextField
          type="password"
          placeholder="Insira a sua nova senha"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          type="password"
          placeholder="Confirme a sua nova senha"
          fullWidth
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <Button variant="contained" fullWidth type="submit">
          Salvar Senha
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

export default PasswordUpdate;
