import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addToCart } from '../api';
import { Card, CardMedia, CardContent, Typography, Button, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (product && product._id) {
        await addToCart(product._id);
        alert('Product added to cart successfully');
      } else {
        alert('Product is missing an ID');
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const productName = product.name || 'Product Name Not Available';
  const productCategory = product.categoryId ? product.categoryId.name : 'Category Not Available';
  const productImage = product.image ? `http://localhost:5000/uploads/${product.image}` : '/path/to/placeholderimage.jpg';
  const productDescription = product.description || 'Description not available';
  const productPrice = product.price || 'N/A';

  return (
    <Box sx={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card sx={{ display: 'flex', maxWidth: 1200, boxShadow: 6, borderRadius: '16px', overflow: 'hidden' }}>
          <Grid container>
           
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                image={productImage}
                alt={productName}
                sx={{
                  height: '100%',
                  objectFit: 'cover',
                  maxHeight: '400px',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Grid>

           
            <Grid item xs={12} md={6}>
              <CardContent sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>
                  {productName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '1rem' }}>
                  {productDescription}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ marginBottom: '1rem' }}>
                  Price: ${productPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '2rem' }}>
                  Category: {productCategory}
                </Typography>

                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  sx={{
                    padding: '10px 20px',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ProductDetails;
