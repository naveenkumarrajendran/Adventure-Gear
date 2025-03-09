import React, { useEffect, useState } from 'react';
import { getAllOrdersForAdmin, updateOrderStatus } from '../api';  
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrdersForAdmin();
        setOrders(allOrders);
      } catch (error) {
        setError('Failed to fetch orders.');
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders(orders.map(order => order._id === orderId ? updatedOrder : order));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div>
      <h2>Admin Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId?.name}</td>
              <td>
                {order.orderItems.map((item) => (
                  <div key={item.productId._id}>
                    {item.productId.name} (x{item.quantity})
                  </div>
                ))}
              </td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleStatusUpdate(order._id, 'shipped')}>
                  Mark as Shipped
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
