import { useEffect, useRef } from "react";
import {
  FaAngleDoubleUp,
  FaBook,
  FaBriefcase,
  FaFolder,
  FaHome,
  FaPaperclip,
  FaRegFileAlt,
  FaRegSun,
  FaTimes,
  FaUserAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUserState } from "../../hooks/useUserState";
import SidebarItem from "../SidebarItem";
import { Container, Content } from "./styles";

const Sidebar = ({ active }) => {
  const { permissions } = useUserState().state;
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
  //eslint-disable-next-line
  const rolesPermissions = [
    "view_roles",
    "view_any_roles",
    "create_roles",
    "update_roles",
    "delete_roles",
    "view_from_company",
    "view_tasks"
  ];
  //eslint-disable-next-line
  const auditoriaPermissions = ["view_any_tasks", "update_tasks"];
  const relatorioPermissions = ["view_any_reports", "report_generate"];
  const osPermissions = ["view_any_work_orders", "update_work_orders", "create_work_orders", "view_work_orders", "delete_work_orders", "assign_work_orders", "be_assigned_work_orders"];
  const defineRules = ["define_rules"];
  const logPermissions = ["view_any_logs"];

  const sidebarRef = useRef();

  const hasPermission = (requiredPermissions) => {
    return permissions?.some((permission) =>
      requiredPermissions.includes(permission.name),
    );
  };

  const closeSidebar = () => {
    active(false);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

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
        <Link to="/permissoes">
          <SidebarItem Icon={FaRegSun} Text="Minhas Permissões" />
        </Link>
        {hasPermission(logPermissions) ? (
          <Link to="/logs">
            <SidebarItem Icon={FaBook} Text="Logs" />
          </Link>
        ) : null}
        {hasPermission(osPermissions) ? (
          <Link to={"/atribuicoes"}>
            <SidebarItem Icon={FaBook} Text="Ordens de serviço" />
          </Link>
        ) : null}
      </Content>
    </Container>
  );
};

export default Sidebar;
