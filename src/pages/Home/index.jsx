import React from 'react'
import { useNavigate } from 'react-router-dom'
import UserService from '../../services/UserService'
import './index.css'
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const Home = () => {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await UserService.logout()
      navigate('/')

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <header className='topo'>
        <MenuIcon className='menu' />
        <h1>App Provedores</h1>
      </header>
      <h1>Bem vindo, Administrador!</h1>
      <button className='logout' onClick={logout}><LogoutIcon /></button>


    </div>
  )
}

export default Home