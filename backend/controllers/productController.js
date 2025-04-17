const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); 
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
      const categoryName = req.params.category;

      const category = await Category.findOne({ name: categoryName });

      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      const products = await Product.find({ categoryId: category._id }).populate('categoryId'); 

      if (!products || products.length === 0) {
          return res.status(404).json({ message: 'No products found for this category' });
      }

      res.status(200).json(products);
  } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory
};