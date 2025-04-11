import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Container,
    Button,
    IconButton,   
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'; 
import { getAdminUsers, deleteUser } from '../api'; 

const AdminUsers = () => {
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminUsers = async () => {
            try {
                const data = await getAdminUsers();
                setAdminUsers(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message || 'Failed to fetch admin users');
                setLoading(false);
            }
        };

        fetchAdminUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setAdminUsers(adminUsers.filter((user) => user._id !== userId));
            alert('User deleted successfully'); 
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to delete user');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Users
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="admin users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Actions</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminUsers.map((user) => (
                            <TableRow
                                key={user._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell align="right">{user.email}</TableCell>
                                <TableCell align="right">{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteUser(user._id)}
                                        aria-label="delete user"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                              
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminUsers;