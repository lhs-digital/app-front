import React, { useState, useContext } from 'react'
import './signin.css'
import logo from '../../assets/Logo_1.svg'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth'
import { Checkbox, Heading, Text } from '@chakra-ui/react'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const { signIn } = useContext(AuthContext)

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe)
  }

  const Login = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      toast.warning('Preencha o email e a senha para acessar o sistema!')
      return
    }

    try {
      await signIn(email, password, rememberMe)
      navigate('/dashboard')

    } catch (error) {
      toast.error('Email ou senha inválidos!')
    }
  }

  return (
    <div className='container-center'>
      <div className="login">
          <img src={logo} alt="Logo do App Provedores" />
        <div className="login-area">
          <Heading marginTop="">App Provedores</Heading>
          <Text color="white">Sistema de Gerenciamento de Provedores</Text>
        </div>

        <form onSubmit={Login}>
          <input
            type="email"
            placeholder="Digite o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
          />

          <div className='remember-me'>
          
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            >Lembrar-me por 7 dias</Checkbox>
          </div>

          <button type='submit'>ENTRAR</button>
        </form>

        <Link to="/recover-password">Esqueceu sua senha? Recuperar senha</Link>

      </div>
    </div>
  )
}

export default SignIn