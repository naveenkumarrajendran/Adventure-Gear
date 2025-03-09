import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState(); 
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshCategories, setRefreshCategories] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, [refreshCategories]); 
  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/categories',
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setNewCategoryName('');
      setSuccess('Category created successfully!');
      setError(null); 
      setRefreshCategories((prev) => !prev)
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category.');
      setSuccess(null); 
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>

      <ul>
        {categories && categories.length > 0 ? ( 
          categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))
        ) : (
          <li>No categories found.</li> 
        )}
      </ul>

   
      <h3>Create New Category</h3>
      {error && <div className="error">{error}</div>} 
      {success && <div className="success">{success}</div>} 
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Category Name"
      />
      <button onClick={handleCreateCategory}>Create Category</button>
    </div>
  );
};

export default AdminCategories;