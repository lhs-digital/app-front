import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lighthouse from "../../../assets/favicon_neutral.svg";
import CompanyPicker from "../../../components/CompanyPicker";
import { useUserState } from "../../../hooks/useUserState";
import api from "../../../services/api";
import { formatUserObject } from "../../../services/utils";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const [rememberMe, setRememberMe] = useState(false);
  const [companyPickerOpen, setCompanyPickerOpen] = useState(
    isAuthenticated || false,
  );
  const signIn = useSignIn();
  const navigate = useNavigate();
  const { setUserState } = useUserState();
  const authUser = useAuthUser();

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onCompanyPickerClose = (success = false) => {
    console.log("onCompanyPickerClose", success);
    if (success) {
      navigate("/painel");
      setCompanyPickerOpen(false);
    } else {
      if (authUser?.isLighthouse) {
        navigate("/painel");
        setCompanyPickerOpen(false);
      } else {
        toast.error("Selecione uma empresa para continuar.");
        setTimeout(() => {
          setCompanyPickerOpen(true);
        }, 1000);
      }
    }
  };

  const login = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!email || !password) {
      toast.warning("Preencha o email e a senha para acessar o sistema!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/login`, { email, password });
      const formattedUser = formatUserObject(response.data.user);
      if (
        signIn({
          auth: {
            token: response.data.access_token,
            type: "Bearer",
          },
          userState: formatUserObject(formattedUser),
        })
      ) {
        setUserState(formattedUser);

        if (formattedUser.isLighthouse) {
          navigate("/painel");
        } else {
          setCompanyPickerOpen(true);
        }
      } else {
        toast.error("Ocorreu um erro ao realizar login.");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message || "Email ou senha inválidos!");
      } else {
        toast.error("Ocorreu um erro ao realizar login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-black flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
      {companyPickerOpen && (
        <CompanyPicker
          open={companyPickerOpen}
          onClose={onCompanyPickerClose}
        />
      )}
      <div className="absolute login-bg top-0 left-0 w-screen h-screen opacity-40 grayscale" />
      <form
        onSubmit={login}
        className={`z-20 ${companyPickerOpen && "hidden"} dark:bg-black/75 bg-white/75 backdrop-blur-sm shadow-2xl shadow-black/50 flex flex-col gap-6 w-[95vw] sm:w-[450px] border border-black/10 dark:border-white/10 p-10 rounded-2xl`}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full p-3 shadow-lg">
            <img
              src={Lighthouse}
              alt="Lighthouse"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Bem-vindo ao Lighthouse</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Entre com suas credenciais para acessar a plataforma.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          <TextField
            disabled={loading}
            fullWidth
            type="email"
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            variant="outlined"
          />
          <TextField
            disabled={loading}
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Senha"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined fontSize="small" />
                      ) : (
                        <VisibilityOutlined fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        {/* Remember Me */}
        <div className="flex flex-row items-center -mt-2">
          <Checkbox
            disabled={loading}
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            size="small"
          />
          <label
            className="text-sm cursor-pointer select-none"
            htmlFor="rememberMe"
          >
            Mantenha-me conectado por 7 dias
          </label>
        </div>

        {/* Submit Button */}
        <Button variant="contained" fullWidth type="submit" loading={loading}>
          Entrar
        </Button>

        {/* Forgot Password Link */}
        <Link
          to="/recover-password"
          className="text-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary-light transition-colors"
        >
          Esqueceu sua senha?{" "}
          <span className="underline font-medium">Recuperar senha</span>
        </Link>
      </form>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-white/80 z-10">
        &copy; {new Date().getFullYear()} Lighthouse Software Systems
      </div>
    </div>
  );
};

export default SignIn;
