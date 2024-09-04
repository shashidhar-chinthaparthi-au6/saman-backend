const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
  
  // Define the addProduct function
  exports.addProduct = async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Request Files:", req.files);
  
      const images = req.files ? req.files.map(file => file.path) : [];
  
      const { name, price, category, subcategory } = req.body;
  
      if (!name || !price || !category || !subcategory) {
        return res.status(400).json({
          success: false,
          error: 'Name, price, category, and subcategory are required.'
        });
      }
  
      const product = await Product.create({
        name,
        description: req.body.description,
        price,
        category,
        subcategory,
        images,
      });
  
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  };
  
exports.createAdmin = async (req, res) => {
  try {
    const admin = await User.create({
      ...req.body,
      role: 'Admin',
    });
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Confirmed' }, { new: true });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search

    const products = await Product.find(query);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};


exports.getProductsBySubCategory = async (req, res) => {
  try {
      const { subCategoryId } = req.params;
      const products = await Product.find({ subcategory: subCategoryId });
      res.json({ success: true, data: products });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
};