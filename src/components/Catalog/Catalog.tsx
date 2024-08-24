import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Badge,
  Menu,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Person as PersonIcon,
  AccountBox as AccountBoxIcon,
  ExitToApp as ExitToAppIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import catalogueSVG from '../../ui/assets/images/catalogue-svg.svg';

const GradientChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1AA776 0%, #098598 100%)',
  padding: '16px 8px',
  color: theme.palette.common.white,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

interface MenuItem {
  text: string;
  icon: React.ReactElement;
}

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface Property {
  id: number;
  name: string;
  description: string;
  price: string;
}

const Catalog: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulación de llamada a API para obtener propiedades
    const fetchProperties = async () => {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    };

    fetchProperties();
  }, []);

  const handleMenu = (): void => {
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const handleNotifications = (): void => {
    setNotificationsOpen(true);
  };

  const closeNotifications = (): void => {
    setNotificationsOpen(false);
  };

  const menuItems: MenuItem[] = [
    { text: 'Perfil', icon: <PersonIcon /> },
    { text: 'Mi cuenta', icon: <AccountBoxIcon /> },
    { text: 'Cerrar sesión', icon: <ExitToAppIcon /> },
  ];

  const notifications: Notification[] = [
    { id: 1, message: 'Nueva inversión disponible', time: '2 min ago' },
    { id: 2, message: 'Actualización de proyecto', time: '1 hora ago' },
    { id: 3, message: 'Recordatorio de pago', time: '3 horas ago' },
    { id: 4, message: 'Nuevo mensaje del equipo', time: '5 horas ago' },
    { id: 5, message: 'Reporte mensual listo', time: '1 día ago' },
  ];

  const NotificationBadge: React.FC = () => (
    <GradientChip
      icon={<NotificationsIcon />}
      label="5"
      size="small"
      sx={{
        borderRadius: '16px',
        '& .MuiChip-label': { pl: 1 },
      }}
    />
  );

  const UserMenu: React.FC = () => (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            {...bindTrigger(popupState)}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>LP</Avatar>
            {!isMobile && (
              <>
                <Typography variant="body1" sx={{ ml: 1, mr: 1, color: '#585858' }}>
                  Lucas Pérez
                </Typography>
                <ArrowDropDownIcon sx={{ color: '#585858' }} />
              </>
            )}
          </Box>
          <Menu {...bindMenu(popupState)}>
            {menuItems.map((item) => (
              <MenuItem key={item.text} onClick={popupState.close}>
                <ListItemIcon sx={{ color: '#585858' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  );

  const AppBarContent: React.FC = () => (
    <>
      {isMobile ? (
        <>
          <IconButton edge="start" onClick={handleNotifications} sx={{ color: '#585858' }}>
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={handleMenu}
            aria-label="menu"
            component="div"
            sx={{ color: '#585858' }}
          >
            <MenuIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <NotificationBadge />
          <Box sx={{ ml: 2 }}>
            <UserMenu />
          </Box>
        </>
      )}
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: isMobile ? '#ffffff' : 'background.default',
          boxShadow: isMobile ? '0px 0px 16px 0px rgba(0, 0, 0, 0.11)' : 'none',
        }}
      >
        <Toolbar>
          <AppBarContent />
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.default' }}>
          <Typography variant="h6" component="h1" sx={{ color: '#2B2964', fontWeight: 'bold' }}>
            Catálogo
          </Typography>
        </Box>
      )}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text}>
                <ListItemIcon sx={{ color: '#585858' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ sx: { color: '#585858' } }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Drawer
        anchor="left"
        open={notificationsOpen}
        onClose={closeNotifications}
      >
        <Box
          sx={{ width: 300 }}
          role="presentation"
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Notificaciones (5)
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={closeNotifications}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText 
                  primary={notification.message}
                  secondary={notification.time}
                  primaryTypographyProps={{ sx: { color: '#585858' } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: `calc(100vh - 64px - ${isMobile ? '48px' : '0px'})`, // Subtract AppBar height and mobile title height if applicable
            py: 4,
          }}
        >
          {properties.length > 0 ? 
            <ul>
              {properties.map((property: Property) => (
                <li key={property.id}>
                  <h2>{property.name}</h2>
                  <p>{property.description}</p>
                  <p>Precio: {property.price}</p>
                </li>
              ))}
            </ul>
            : 
            <>
              <Box
                component="img"
                src={catalogueSVG}
                alt="No projects illustration"
                sx={{ width: '100%', maxWidth: 300, mb: 4 }}
              />
              <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#2B2964' }}>
                Aún no hay proyectos
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: '304px' }}>
                De momento no hay proyectos disponibles para invertir. Estamos
                trabajando en ello.
              </Typography>
            </>
          }
        </Box>
      </Container>
    </Box>
  );
};

export default Catalog;