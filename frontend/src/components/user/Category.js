
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../api';
import '../styles/ProductCard.css';

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
  try {
    const response = await getProductsByCategory(category);
    setProducts(response);
  } catch (error) {
  }
};

    fetchProducts();
  }, [category]);

  return (
    <div>
      <h2>{category} Products</h2>
      <div className="d-flex flex-wrap">
        {products.map((product) => (
          <div className="card bg-dark text-white product-card mx-2 my-2" key={product._id}>
            <img className="card-img" src={product.image} alt={product.title} />
            <div className="card-img-overlay">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-text">Category: {product.category}</p>
              <p className="card-text">Price: {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
