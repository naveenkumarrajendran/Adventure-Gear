import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar as NavbarBs, Nav, NavDropdown } from 'react-bootstrap'; 
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = ({ cartItems }) => {
  const cartItemCount = cartItems? cartItems.length: 0;

  return (
    <NavbarBs className="navbar fixed-top" expand="lg" bg="light" variant="light"> 
      <Container>
        <Link to="/" className="navbar-brand">
          Adventure
        </Link>
        <NavbarBs.Toggle aria-controls="navbarNavDropdown" />
        <NavbarBs.Collapse id="navbarNavDropdown">
          <Nav className="mr-auto"> 
            <Nav.Link as={Link} to="/">Home</Nav.Link> 
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <NavDropdown title="Categories" id="navbarDropdownMenuLink">
              <NavDropdown.Item as={Link} to="/category/hiking-boots">Hiking Boots</NavDropdown.Item> 
              <NavDropdown.Item as={Link} to="/category/backpacks">BackPacks</NavDropdown.Item> 
              <NavDropdown.Item as={Link} to="/category/bags">Bags</NavDropdown.Item> 
              <NavDropdown.Item as={Link} to="/category/camp">CampingGear</NavDropdown.Item> 
            </NavDropdown>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
          <div className="navbar-icons">
            <Link to="/cart" className="nav-link cart-icon">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-item-count">{cartItemCount}</span>
              )}
            </Link>
            <Link to="/profile" className="nav-link">
              <FaUser />
            </Link>
          </div>
        </NavbarBs.Collapse>
      </Container>
    </NavbarBs>
  );
};

export default Navbar;