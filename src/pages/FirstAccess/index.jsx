import React, { useEffect, useState } from 'react'
import './signin.css'
import logo from '../../assets/logo.jpg'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { Heading, Text } from '@chakra-ui/react'

const FirstAccess = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const { token } = useParams();
  const navigate = useNavigate();

  // Verificando token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await (api.get(`/password-reset/${token}`));

        if (response.data.token !== token) {
          navigate('/')

        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        navigate('/')
      };
    }

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !passwordConfirmation) {
      toast.warning('Preencha os campos para definir uma nova senha!')
      return
    }

    if (password.length < 8) {
      toast.warning('A senha deve conter no mínimo 8 caracteres!')
      return
    }

    if (password !== passwordConfirmation) {
      toast.warning('Senhas não conferem!')
      return
    }


    try {
      await api.post(`/password-update`, {
        token,
        password,
        password_confirmation: passwordConfirmation
      });

      toast.success('Senha alterada com sucesso!')

      navigate('/')
    } catch (error) {
      toast.error("Erro ao tentar alterar a senha");
    }
  }

  return (
    <div className='container-center'>
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do App Provedores" />
          <Heading>App Provedores</Heading>
          <Text color="white">Sistema de Gerenciamento de Provedores</Text>
        </div>

        <form onSubmit={handleSubmit}>
          <p>Defina sua primeira senha para acessar o sistema</p>
          <input
            type="password"
            placeholder="Insira a sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirme a sua senha"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button type='submit'>Salvar Senha</button>
        </form>

        <Link to="/">Já possui uma conta? Acessar</Link>

      </div>
    </div>
  )
}

export default FirstAccess