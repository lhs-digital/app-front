import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import "./header.css"
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../../services/UserService'
import { Heading } from '@chakra-ui/react';

const Header = () => {

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
        <>
            <header className='topo'>
                {/* <MenuIcon className='menu' /> */}
                <Link to="/"><Heading>App Provedores</Heading></Link>
            </header>
            <button className='logout' onClick={logout}><LogoutIcon /></button>
        </>
    )
}

export default Header