
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    console.log('req.file:', req.file); 

    const { name, description, price, stock, categoryId } = req.body;
    const image = req.file ? req.file.filename : null; 

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      categoryId,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProductById = async (req, res) => {
  try {
    console.log('req.file:', req.file); 

    const { name, description, price, stock, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateData = {
      name,
      description,
      price,
      stock,
      categoryId,
    };

    if (image) {
      updateData.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProductById = async (req, res) => {
  try {
    console.log('Deleting product with ID:', req.params.id);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product deleted:', req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
};