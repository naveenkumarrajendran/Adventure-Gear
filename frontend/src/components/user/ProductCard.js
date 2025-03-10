import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { addToCart } from '../api';
//import {imageSrc} from '../assests/placeholderimage.jpg';


const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      alert('Product added to cart successfully');
    } catch (error) {
      console.error(error); 
    }
  };

  const imageSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : '/path/to/placeholderimage.jpg';

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageSrc}
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
        e.target.src = '/path/to/placeholderimage.jpg';
        }}
      />
   
   <CardContent>
        <Typography variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {product.categoryId?.name || 'N/A'}
        </Typography>
      </CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
        <Button variant="contained" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <Button variant="outlined" color="secondary">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProductCard;