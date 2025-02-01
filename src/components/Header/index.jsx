import {
  Avatar,
  Box,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import Sidebar from "../Sidebar";
import "./header.css";
import { Container } from "./styles";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useContext(AuthContext);

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const showSidebar = () => setSidebar(!sidebar);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Container>
        <FaBars onClick={showSidebar} />
        {sidebar && <Sidebar active={setSidebar} />}
        <Link to="/dashboard">
          <Heading className="white">App-Provedores</Heading>
        </Link>

        <Box
          display="flex"
          alignItems="center"
          bg="#1A202C"
          color="white"
          borderRadius="md"
          p={2}
          boxShadow="lg"
          position="absolute"
          right={isMobile ? -3 : "20px"}
          top="50%"
          transform="translateY(-50%)"
        >
          <Avatar
            name={user?.name}
            src={user?.profilePicture || ""}
            size="lg"
            mr={4}
          />
          <Box
            align="flex-start"
            display={isMobile ? "none" : "flex"}
            flexDirection="column"
            gap="0"
          >
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={"white"}
              marginBottom={-2}
              padding={0}
            >
              {user?.user?.name}
            </Text>
            <Text fontSize="sm" color={"gray.400"}>
              {user?.user?.email}
            </Text>
            <Text fontSize="sm" color="white" marginBottom={-2} padding={0}>
              Empresa: {user?.user?.company?.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              CNPJ: {user?.user?.company?.cnpj}
            </Text>
          </Box>
        </Box>
      </Container>

      <button className="logout" onClick={handleLogout}>
        <LogoutIcon />
      </button>
    </>
  );
};

export default Header;
