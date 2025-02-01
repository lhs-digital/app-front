import { Button, Checkbox, TextField, Tooltip } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lighthouse from "../../assets/favicon_neutral.svg";
import { AuthContext } from "../../contexts/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { signIn } = useContext(AuthContext);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const Login = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.warning("Preencha o email e a senha para acessar o sistema!");
      return;
    }

    try {
      await signIn(email, password, rememberMe);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Email ou senha inválidos!");
    }
  };

  return (
    <div className="relative bg-black flex flex-col items-center justify-center h-screen gap-8">
      <div className="absolute login-bg top-0 left-0 w-screen h-screen opacity-40 grayscale" />
      <form
        onSubmit={Login}
        className="z-20 bg-white shadow-lg shadow-white/50 flex flex-col gap-4 w-[95vw] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/3 border p-8 rounded-lg"
      >
        <h1 className="text-2xl">Entrar</h1>
        <TextField
          fullWidth
          type="email"
          placeholder="Digite o seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          fullWidth
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <div className="flex flex-row items-center">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          <label className="mt-0.5" htmlFor="rememberMe">
            Mantenha-me conectado por 7 dias
          </label>
        </div>
        <Button variant="contained" fullWidth type="submit">
          ENTRAR
        </Button>
        <Link to="/recover-password" className="mt-4 text-center">
          Esqueceu sua senha? <span className="underline">Recuperar senha</span>
        </Link>
      </form>
      <div className="absolute bottom-2 text-xs text-white">
        &copy; {new Date().getFullYear()} Lighthouse
      </div>
      <Tooltip
        title="Powered by Lighthouse Software Systems"
        arrow
        placement="left"
      >
        <div className="absolute shadow-md shadow-white/50 flex flex-col items-center justify-center bottom-10 right-10 text-white bg-white aspect-square px-3 rounded-full">
          <img src={Lighthouse} alt="Lighthouse" className="w-8 h-8 mb-1" />
        </div>
      </Tooltip>
    </div>
  );
};

export default SignIn;
