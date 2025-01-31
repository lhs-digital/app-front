import { Logout, Menu } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import React, { useContext, useState } from 'react';
import { FaBook, FaBriefcase, FaCog, FaFile, FaFolder, FaHome, FaLock, FaScroll, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import lighthouse from '../assets/favicon_neutral.svg';
import { AuthContext } from '../contexts/auth';

const drawerWidth = 320;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const sidebarItems = [
    {
      label: 'Início',
      url: '/dashboard',
      icon: <FaHome size={20}/>,
    },
    {
      label: 'Usuários',
      url: '/users',
      icon: <FaUser size={20}/>,
    },
    {
      label: 'Empresas',
      url: '/companies',
      icon: <FaBriefcase size={20}/>,
    },
    {
      label: 'Papéis & Permissões',
      url: '/roles',
      icon: <FaLock size={20}/>,
    },
    {
      label: 'Clientes',
      url: '/clientes',
      icon: <FaFolder size={20}/>,
    },
    {
      label: 'Regras de Auditorias',
      url: '/prioridades',
      icon: <FaScroll size={20}/>,
    },
    {
      label: 'Relatórios de Auditorias',
      url: '/relatorios',
      icon: <FaFile size={20}/>,
    },
    {
      label: 'Minhas Permissões',
      url: '/my-permissions',
      icon: <FaCog size={20}/>,
    },
    {
      label: 'Logs',
      url: '/logs',
      icon: <FaBook size={20}/>,
    }
  ]

const Index = ({children}) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
      logout();
      navigate('/');
  };

  const [open, setOpen] = useState(true)
  return (
    <div className='flex flex-row h-screen w-full'>
      <Drawer variant='permanent' anchor='left' open={open} onClose={() => setOpen(false)}>
        <div className="h-16 p-4 w-full flex flex-row items-center border-b justify-end">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Menu/>
          </IconButton>
        </div>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component="a" href={item.url}  
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    backgroundColor: window.location.pathname === item.url ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  },
                ]}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
          </ListItem>
          ))}
        </List>
      </Drawer>
      <div className='grow flex flex-col'>
        <div className='h-16 border-b flex flex-row items-center justify-between px-4'>
          <img src={lighthouse} alt="Lighthouse" className='h-10 mb-1' />
          <IconButton variant="outlined" color="info" onClick={handleLogout}><Logout/></IconButton>
        </div>
        <div className='max-h-[calc(100vh-4rem)] p-8 overflow-y-scroll'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Index