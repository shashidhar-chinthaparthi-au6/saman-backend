const Category = require('../models/Category');
const Product = require('../models/Product');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Add a subcategory to a category
exports.addSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        category.subCategories.push({ name });
        await category.save();
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category: categoryId });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get products by subcategory
exports.getProductsBySubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params;
        const products = await Product.find({ subCategory: subCategoryId });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
