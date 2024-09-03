const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.addCategory = async (req, res) => {
    try {
      const existingCategory = await Category.findOne({ name: req.body.name });
      if (existingCategory) {
        return res.status(400).json({ success: false, error: 'Category with this name already exists' });
      }
      
      const category = await Category.create(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ success: false, error: 'Category with this name already exists' });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  };
  

exports.addSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ category: req.params.categoryId });
    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
    try {
      const subcategories = await Subcategory.find();
      res.status(200).json({ success: true, data: subcategories });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
  
  exports.removeCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      // Remove subcategories associated with the category
      await Subcategory.deleteMany({ category: categoryId });
  
      // Remove the category
      await Category.findByIdAndDelete(categoryId);
  
      res.status(200).json({ message: 'Category and related subcategories removed successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing category', error });
    }
  };

  exports.removeSubcategory = async (req, res) => {
    try {
      const subcategoryId = req.params.id;
  
      // Remove the subcategory
      await Subcategory.findByIdAndDelete(subcategoryId);
  
      res.status(200).json({ message: 'Subcategory removed successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing subcategory', error });
    }
  };