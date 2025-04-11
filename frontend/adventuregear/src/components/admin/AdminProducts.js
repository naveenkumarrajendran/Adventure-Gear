import React, {
  useState,
  useEffect
} from 'react';
import {
  Outlet
} from 'react-router-dom';
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
  Pagination,
  styled,
  IconButton,
  Input,
} from '@mui/material';
import {
  getProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getCategories
} from '../api';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const StyledTableContainer = styled(TableContainer)({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflowX: 'auto',
  backgroundColor: '#f9f9f9', 
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  color: '#333', 
});

const StyledTableRow = styled(TableRow)(({
  theme
}) => ({
  '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
      border: 0
  },
}));

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
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(5);

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
      setNewProduct({
          ...newProduct,
          [e.target.name]: e.target.value
      });
  };

  const handleImageChange = (e) => {
      setNewProduct({
          ...newProduct,
          image: e.target.files[0]
      });
  };

  const handleCreateProduct = async (e) => {
      e.preventDefault();
      try {
          const formData = new FormData();
          formData.append('name', newProduct.name);
          formData.append('description', newProduct.description);
          formData.append('price', newProduct.price);
          formData.append('stock', newProduct.stock);
          formData.append('categoryId', newProduct.categoryId);

          if (newProduct.image) {
              formData.append('image', newProduct.image);
          }

          await createProduct(formData);

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
          alert('Product created successfully!'); 
      } catch (error) {
          console.error('Failed to create product:', error);
          alert('Failed to create product. Please try again.'); 
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
          formData.append('name', newProduct.name);
          formData.append('description', newProduct.description);
          formData.append('price', newProduct.price);
          formData.append('stock', newProduct.stock);
          formData.append('categoryId', newProduct.categoryId);

          if (newProduct.image) {
              formData.append('image', newProduct.image);
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
          alert('Product updated successfully!'); 
      } catch (error) {
          console.error('Failed to update product:', error);
          alert('Failed to update product. Please try again.'); 
      }
  };

  const handleDeleteProduct = async (productId) => {
      try {
          if (window.confirm('Are you sure you want to delete this product?')) {
              await deleteProductById(productId);
              const updatedProducts = await getProducts();
              setProducts(updatedProducts);
              alert('Product deleted successfully!'); 
          }
      } catch (error) {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.'); 
      }
  };

  if (!products || !categories) {
      return <div>Loading...</div>;
  }

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
      setPage(value);
  };
  return (
      <Container>
          <Typography variant="h4"
          gutterBottom>
              Products
          </Typography>

          <StyledTableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Description</StyledTableCell>
                          <StyledTableCell>Price</StyledTableCell>
                          <StyledTableCell>Stock</StyledTableCell>
                          <StyledTableCell>Category</StyledTableCell>
                          <StyledTableCell>Image</StyledTableCell>
                          <StyledTableCell>Actions</StyledTableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {
                          currentProducts.map((product) => (
                              <StyledTableRow key={product._id}>
                                  <TableCell>{product.name}</TableCell>
                                  <TableCell>{product.description}</TableCell>
                                  <TableCell>{product.price}</TableCell>
                                  <TableCell>{product.stock}</TableCell>
                                  <TableCell>{product.categoryId?.name || 'No Category'}</TableCell>
                                  <TableCell>
                                      {
                                          product.image && (
                                              <img
                                                  src={`http://localhost:5000/uploads/${product.image}`}
                                                  alt={product.name}
                                                  style={{
                                                      maxWidth: '100px'
                                                  }}
                                              />
                                          )
                                      }
                                  </TableCell>
                                  <TableCell>
                                      <IconButton
                                          color="primary"
                                          onClick={() => handleEditProduct(product)}
                                          aria-label="edit product"
                                      >
                                          <EditIcon />
                                      </IconButton>
                                      <IconButton
                                          color="error"
                                          onClick={() => handleDeleteProduct(product._id)}
                                          aria-label="delete product"
                                      >
                                          <DeleteIcon />
                                      </IconButton>
                                  </TableCell>
                              </StyledTableRow>
                          ))
                      }
                  </TableBody>
              </Table>
          </StyledTableContainer>

          <Box display="flex"
          justifyContent="center"
          mt={3}>
              <Pagination
                  count={Math.ceil(products.length / productsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
              />
          </Box>

          <Typography variant="h5"
          gutterBottom
          style={{
              marginTop: '20px'
          }}>
              {
                  editingProduct ? 'Edit Product' : 'Create Product'
              }
          </Typography>

          <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          id="yourFormId">
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
                      inputProps={{
                          min: 0
                      }}
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
                          {
                              categories.map((category) => (
                                  <MenuItem key={category._id}
                                  value={category._id}>
                                      {category.name}
                                  </MenuItem>
                              ))
                          }
                      </Select>
                  </FormControl>
              </Box>

              <Box mt={2}>
                  <Input type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange} />
                  {
                      editingProduct && editingProduct.image && !newProduct.image && (
                          <div>
                              <Typography variant="body2">Current Image:</Typography>
                              <img
                                  src={`http://localhost:5000/uploads/${editingProduct.image}`}
                                  alt={editingProduct.name}
                                  style={{
                                      maxWidth: '100px'
                                  }}
                              />
                          </div>
                      )
                  }
              </Box>
              <Box mt={2}>
                  <Button variant="contained"
                  color="primary"
                  type="submit">
                      {
                          editingProduct ? 'Update Product' : 'Create Product'
                      }
                  </Button>
                  {
                      editingProduct && (
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
                              style={{
                                  marginLeft: '10px'
                              }}
                          >
                              Cancel Edit
                          </Button>
                      )
                  }
              </Box>
          </form>

          <Outlet />
      </Container>
  );
};

export default AdminProducts;