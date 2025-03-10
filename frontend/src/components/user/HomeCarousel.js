
import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/HomeCarousel.css';
import carouselone from '../assests/carouselone.jpg';
import carouseltwo from '../assests/carouseltwo.jpg';
import carouselthree from '../assests/carouselthree.jpg';
import carouselfour from '../assests/carouselfour.jpg';

const HomeCarousel = () => {
  return (
    <>
      <Carousel>
        <Carousel.Item>
       <img  className="d-block w-100"  src={carouselone} alt='first slide'/>
          <Carousel.Caption>
            <h3>10% OFF YOUR FIRST ORDER</h3>
            <p>Reasonable Price and 10% OFF YOUR FIRST ORDER</p>
            <div className="text-center mt-3">
              <Link to="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={carouseltwo} alt="Second slide" />
          <Carousel.Caption>
            <h3>Discover,Select and Travel</h3>
            <p>Add style to your trip with our wide range of adventure gear items</p>
            <div className="text-center mt-3">
              <Link to="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={carouselthree} alt="Third slide" />
          <Carousel.Caption>
            <h3>Explore various hikingboots</h3>
            <p>Find the latest hiking boots for your travel needs</p>
            <div className="text-center mt-3">
              <Link to="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={carouselfour} alt="Fourth slide" />
          <Carousel.Caption>
            <h3>Backpacks</h3>
            <p>Shop trendy and fashionable backpacks for your adventure</p>
            <div className="text-center mt-3">
              <Link to="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default HomeCarousel;
