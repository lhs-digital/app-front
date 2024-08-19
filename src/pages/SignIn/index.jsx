import React, { useState } from 'react'
import './signin.css'
import logo from '../../assets/logo.jpg'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='container-center'>
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do App Provedores" />
          <h1>App Provedores</h1>
          <p>Sistema de Gerenciamento de Provedores</p>
        </div>

        <form>
          <input
            type="email"
            placeholder="Digite o seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit'>Acessar</button>
        </form>

        <Link to="/recover-password">Esqueceu sua senha? Recuperar senha</Link>

      </div>
    </div>
  )
}

export default SignIn