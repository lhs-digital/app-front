import React from 'react'
import { Container, Content } from './styles'
import {
    FaTimes,
    FaHome,
    FaRegSun,
    FaUserAlt,
    FaBriefcase,
    FaRegFileAlt,
    FaBook,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

import SidebarItem from '../SidebarItem'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

const Sidebar = ({ active }) => {
    const { permissions } = useContext(AuthContext);
    const usersPermissions = ['view_users', 'view_any_users', 'update_users', 'delete_users'];
    const companyPermissions = ['view_companies', 'view_any_companies', 'update_companies', 'delete_companies'];
    const rolesPermissions = ['view_roles', 'view_any_roles', 'update_roles', 'delete_roles'];

    const hasPermission = (thePermissions) => {
        return permissions.some(permission =>
            thePermissions.includes(permission.name)
        );
    }

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
                {hasPermission(usersPermissions) ?
                    (
                        <Link to="/users">
                            <SidebarItem Icon={FaUserAlt} Text="Gerenciamento de Usuários" />
                        </Link>
                    )
                    : null
                }
                {hasPermission(companyPermissions) ?
                    (
                        <Link to="/companies">
                            <SidebarItem Icon={FaBriefcase} Text="Gerenciamento de Empresas" />
                        </Link>
                    )
                    : null
                }

                {hasPermission(companyPermissions) ?
                    (
                        <Link to="/roles">
                            <SidebarItem Icon={FaRegFileAlt} Text="Gerenciamento de Roles" />
                        </Link>
                    )
                    : null
                }

                <Link to="/my-permissions">
                    <SidebarItem Icon={FaRegSun} Text="Minhas Permissões" />
                </Link>


                {hasPermission("view_any_logs") ?
                    (
                        <Link to="/logs">
                            <SidebarItem Icon={FaBook} Text="Logs" />
                        </Link>
                    )
                    : null
                }

            </Content>
        </Container>
    )
}

export default Sidebar