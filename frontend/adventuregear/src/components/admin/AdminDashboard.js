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
    Box,
} from '@mui/material';
import {
    Inventory2 as InventoryIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    Dashboard as DashboardIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

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
    const [loading, setLoading] = useState(true);

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAdminDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
           
            <Link to="/admin/categories">Manage Categories</Link>

            <Main open={isDrawerOpen}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" gutterBottom>
                        Admin Dashboard
                    </Typography>

                    <Grid container spacing={3}>
                       
                        <Grid item xs={12} md={12}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Typography variant="h6" gutterBottom>
                                    Product List
                                </Typography>
                                <BarChart
                                    width={800}
                                    height={400} 
                                    data={dashboardData?.productCounts || []}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Main>
        </div>
    );
};

export default AdminDashboard;