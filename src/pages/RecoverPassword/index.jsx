import React, { useState } from 'react'
import './signin.css'
import logo from '../../assets/logo.jpg'
import { Link } from 'react-router-dom'

const RecoverPassword = () => {
  const [email, setEmail] = useState('')

  return (
    <div className='container-center'>
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do App Provedores" />
          <h1>App Provedores</h1>
          <p>Sistema de Gerenciamento de Provedores</p>
        </div>

        <form>
          <p>Um código de recuperação de senha será enviado ao seu email, caso esteja cadastrado no sistema.</p>
          <input
            type="email"
            placeholder="Insira o seu email"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <button type='submit'>Enviar Código</button>
        </form>

        <Link to="/">Já possui uma conta? Acessar</Link>

      </div>
    </div>
  )
}

export default RecoverPassword