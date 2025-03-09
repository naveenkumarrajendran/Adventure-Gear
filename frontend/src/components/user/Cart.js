import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css'

const Cart = ({ cartItems, cartItemCount, removeFromCart }) => {
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className='cart'>
      <h2>Cart</h2>
      <p>Item count: {cartItemCount}</p>
      <div className="card-deck">
        {cartItems.map((item) => (
          <div className="card" key={item._id} style={{ width: '18rem' }}>
            <img className="card-img-top" src={item.product.image} alt={item.product.name} />
            <div className="card-body">
              <h5 className="card-title">{item.product.name}</h5>
              <p className="card-text">Price: ${item.product.price}</p>
              <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.product._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
    </div>
  );
};

export default Cart;