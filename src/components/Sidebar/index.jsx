import React from 'react'
import { Container, Content } from './styles'
import {
    FaTimes,
    FaHome,
    FaRegSun,
    FaUserAlt,
    FaBriefcase,
    FaRegFileAlt,
    FaDoorOpen,
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

import SidebarItem from '../SidebarItem'

const Sidebar = ({ active }) => {
    const navigate = useNavigate();

    const closeSidebar = () => {
        active(false)
    }

    return (
        <Container sidebar={active}>
            <FaTimes onClick={closeSidebar} />
            <Content>
                <Link to="/dashboard">
                    <SidebarItem Icon={FaHome} Text="Início" />
                </Link>
                <Link to="/users">
                    <SidebarItem Icon={FaUserAlt} Text="Gerenciamento de Usuários" />
                </Link>
                <Link to="/companies">
                    <SidebarItem Icon={FaBriefcase} Text="Gerenciamento de Empresas" />
                </Link>
                <Link to="/roles">
                    <SidebarItem Icon={FaRegFileAlt} Text="Gerenciamento de Roles" />
                </Link>
                <Link to="/my-permissions">
                    <SidebarItem Icon={FaRegSun} Text="Minhas Permissões" />
                </Link>
            </Content>
        </Container>
    )
}

export default Sidebar