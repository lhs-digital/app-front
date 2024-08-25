import React, { useState } from 'react'
import './signin.css'
import logo from '../../assets/logo.jpg'
import { Link } from 'react-router-dom'
import UserService from '../../services/UserService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  const Login = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      toast.warning('Preencha o email e a senha para acessar o sistema!')
      return
    }

    try {
      await UserService.login(email, password);
      navigate('/dashboard-admin');
    } catch (error) {
      error.status === 422 ? toast.error('Email ou senha inválidos!') : toast.error('Erro ao tentar acessar o sistema!')
    }
  }

  return (
    <div className='container-center'>
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do App Provedores" />
          <h1>App Provedores</h1>
          <p>Sistema de Gerenciamento de Provedores</p>
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

          <button type='submit'>Acessar</button>
        </form>

        <Link to="/recover-password">Esqueceu sua senha? Recuperar senha</Link>

      </div>
    </div>
  )
}

export default SignIn