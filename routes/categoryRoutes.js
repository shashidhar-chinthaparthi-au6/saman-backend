const express = require('express');
const {
    createCategory,
    addSubCategory,
    getCategories,
    getProductsByCategory,
    getProductsBySubCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin Routes
router.post('/category', protect, authorize('Admin'), createCategory);
router.post('/category/:categoryId/subcategory', protect, authorize('Admin'), addSubCategory);

// Public Routes
router.get('/categories', getCategories);
router.get('/products/category/:categoryId', getProductsByCategory);
router.get('/products/subcategory/:subCategoryId', getProductsBySubCategory);

module.exports = router;
