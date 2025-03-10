import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from '@mui/material';
import { getProducts, createProduct, updateProductById, deleteProductById, getCategories } from '../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch products or categories:', error);
      }
    };

    fetchProductsAndCategories();
  }, []); 

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    console.log('Creating product with data:', newProduct);
    try {
      const formData = new FormData();
      for (const key in newProduct) {
        formData.append(key, newProduct[key]);
      }
      const response = await createProduct(formData);
      console.log('Response after creating product:', response);

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        image: null,
      });
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
      image: null, 
      categoryId: product.categoryId._id || product.categoryId, 
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in newProduct) {
        if (key === 'image' && !newProduct.image) continue; 
        formData.append(key, newProduct[key]);
      }

      await updateProductById(editingProduct._id, formData);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        image: null,
      });
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (window.confirm('Are you sure you want to delete this product?')) {
        await deleteProductById(productId);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (!products || !categories) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.categoryId?.name || 'No Category'}</TableCell>
                <TableCell>
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEditProduct(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        {editingProduct ? 'Edit Product' : 'Create Product'}
      </Typography>

      <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
        <Box mt={2}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            name="description"
            value={newProduct.description}
            onChange={handleChange}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Stock"
            type="number"
            variant="outlined"
            fullWidth
            name="stock"
            value={newProduct.stock}
            onChange={handleChange}
            required
          />
        </Box>

        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={handleChange}
              label="Category"
              required
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={2}>
          <input type="file" id="image" name="image" onChange={handleImageChange} />
          {editingProduct && editingProduct.image && !newProduct.image && (
            <div>
              <Typography variant="body2">Current Image:</Typography>
              <img src={editingProduct.image} alt={editingProduct.name} style={{ maxWidth: '100px' }} />
            </div>
          )}
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
          {editingProduct && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  categoryId: '',
                  image: null,
                });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel Edit
            </Button>
          )}
        </Box>
      </form>

      <Outlet />
    </Container>
  );
};

export default AdminProducts;
