import React from 'react';
import HomeCarousel from './HomeCarousel';
import Products from './Products';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <HomeCarousel />
      <div className="products-container">
        <div className="products-content">
          <Products />
        </div>
      </div>
    </div>
  );
};

export default Home;