import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from './ProductCard';
import '../styles/Products.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.categoryId.name.toLowerCase().includes(term.toLowerCase()) ||
        product.price.toString().includes(term) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const productsToRender = searchTerm ? filteredProducts : products;

  const groupedProducts = productsToRender.reduce((acc, product) => {
    const category = product.categoryId.name || 'Uncategorized'; 
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div>
      <h2>Products</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products..."
        />
        <button className="btn btn-primary" type="button">
          Search
        </button>
      </div>
      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category}>
          <h3 className="category-name">{category}</h3>
          <div className="d-flex flex-wrap">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Link
            to={`/category/${category || 'uncategorized'}`}
            className="btn btn-primary mt-2"
          >
            View All {category || 'Uncategorized'} Products
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Product;
