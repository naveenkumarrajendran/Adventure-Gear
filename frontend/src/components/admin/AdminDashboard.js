import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardData } from '../api';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  Paper,
  Grid,
  CircularProgress,
  IconButton, 
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon, 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDrawerClose} style={{ alignSelf: 'flex-start' }}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          <ListItem button key="Dashboard" component={Link} to="/admin">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button key="Products" component={Link} to="/admin/products">
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button key="Orders" component={Link} to="/admin/orders">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button key="Users" component={Link} to="/admin/users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        </List>
      </Drawer>

      <Link to="/admin/categories">Manage Categories</Link> 

      <Main open={isDrawerOpen}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Admin Dashboard
          </Typography>
          <Paper elevation={3} style={{ padding: '20px' }}>
            {dashboardData ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Total Orders: {dashboardData.totalOrders}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Products in Stock: {dashboardData.productsInStock}</Typography>
                </Grid>
              </Grid>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                <CircularProgress />
              </div>
            )}
          </Paper>
        </Container>
      </Main>
    </div>
  );
};

export default AdminDashboard;