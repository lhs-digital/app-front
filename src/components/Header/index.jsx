import React, { useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import "./header.css"
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../../services/UserService'
import { Heading } from '@chakra-ui/react';
import { Container } from './styles';
import { FaBars } from 'react-icons/fa'
import Sidebar from '../Sidebar';

const Header = () => {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

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
            <Container>
                <FaBars onClick={showSidebar} />
                {sidebar && <Sidebar active={setSidebar} />}
                <Link to='/'>
                    <Heading className='white'>App-Provedores</Heading>
                </Link>
            </Container>

            <button className='logout' onClick={logout}><LogoutIcon /></button>
        </>
    )
}

export default Header