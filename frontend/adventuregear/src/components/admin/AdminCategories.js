import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Delete as DeleteIcon,
    Alert,
    Box,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [refreshCategories, setRefreshCategories] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, [refreshCategories]);

    const handleCreateCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/categories',
                { name: newCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewCategoryName('');
            setSuccess('Category created successfully!');
            setError(null);
            setRefreshCategories((prev) => !prev);
        } catch (error) {
            console.error('Error creating category:', error);
            setError('Failed to create category.');
            setSuccess(null);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Manage Categories
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <List>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <ListItem key={category._id}>
                                <ListItemText primary={category.name} />
                                <ListItemSecondaryAction>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No categories found." />
                        </ListItem>
                    )}
                </List>
            )}

            <Card sx={{ mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Create New Category
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleCreateCategory}
                            >
                                Create Category
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdminCategories;