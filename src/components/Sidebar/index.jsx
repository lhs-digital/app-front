import React, { useEffect, useRef, useContext } from "react";
import { Container, Content } from "./styles";
import {
  FaTimes,
  FaHome,
  FaRegSun,
  FaUserAlt,
  FaBriefcase,
  FaRegFileAlt,
  FaBook,
  FaAngleDoubleUp,
  FaPaperclip,
  FaFolder,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import SidebarItem from "../SidebarItem";
import { AuthContext } from "../../contexts/auth";

const Sidebar = ({ active }) => {
  const { permissions } = useContext(AuthContext);
  const usersPermissions = [
    "view_users",
    "view_any_users",
    "update_users",
    "delete_users",
  ];
  const companyPermissions = [
    "view_companies",
    "view_any_companies",
    "update_companies",
    "delete_companies",
  ];
  const rolesPermissions = [
    "view_roles",
    "view_any_roles",
    "update_roles",
    "delete_roles",
  ];
  const auditoriaPermissions = ["view_any_tasks", "update_tasks"];
  const relatorioPermissions = ["view_any_reports", "report_generate"];
  const defineRules = ["define_rules"];

  const sidebarRef = useRef(); // Ref para o container do sidebar

  const hasPermission = (thePermissions) => {
    return permissions.some((permission) =>
      thePermissions.includes(permission.name),
    );
  };

  const closeSidebar = () => {
    active(false);
  };

  const handleClickOutside = (event) => {
    // Verifica se o clique foi fora do sidebar
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    // Adiciona o evento de clique ao montar o componente
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o evento ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container ref={sidebarRef} sidebar={active}>
      <FaTimes onClick={closeSidebar} />
      <Content>
        <Link to="/dashboard">
          <SidebarItem Icon={FaHome} Text="Início" />
        </Link>
        {hasPermission(companyPermissions) ? (
          <Link to="/companies">
            <SidebarItem Icon={FaBriefcase} Text="Empresas" />
          </Link>
        ) : null}
        {hasPermission(companyPermissions) ? (
          <Link to="/roles">
            <SidebarItem Icon={FaRegFileAlt} Text="Papéis & Permissões" />
          </Link>
        ) : null}
        {hasPermission(usersPermissions) ? (
          <Link to="/users">
            <SidebarItem Icon={FaUserAlt} Text="Usuários" />
          </Link>
        ) : null}
        <Link to="/clientes">
          <SidebarItem Icon={FaFolder} Text="Clientes" />
        </Link>
        {hasPermission(defineRules) ? (
          <Link to="/prioridades">
            <SidebarItem Icon={FaAngleDoubleUp} Text="Regras de Auditorias" />
          </Link>
        ) : null}
        {hasPermission(relatorioPermissions) ? (
          <Link to="/relatorios">
            <SidebarItem Icon={FaPaperclip} Text="Relatórios de Auditorias" />
          </Link>
        ) : null}
        <Link to="/my-permissions">
          <SidebarItem Icon={FaRegSun} Text="Minhas Permissões" />
        </Link>
        {hasPermission("view_any_logs") ? (
          <Link to="/logs">
            <SidebarItem Icon={FaBook} Text="Logs" />
          </Link>
        ) : null}
      </Content>
    </Container>
  );
};

export default Sidebar;
