const express = require('express');
const {
    createAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    confirmOrder,
    cancelOrder,
    getProducts,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { addCategory, addSubcategory, getCategories, getSubcategories, getAllSubcategories, removeCategory, removeSubcategory } = require('../controllers/categoryController');
const upload = require('../middlewares/multerConfig');

const router = express.Router();

// SuperAdmin
router.post('/admin/create', protect, authorize('SuperAdmin'), createAdmin);

// Fetch products with filters
router.get('/products', getProducts);

// Admin
router.post('/product', upload.array('images', 5), addProduct);
router.put('/product/:id',  updateProduct);
router.delete('/product/:id',  deleteProduct);

// Admin - Order management
router.put('/order/confirm/:id',  confirmOrder);
router.put('/order/cancel/:id',  cancelOrder);

// Category and Subcategory
router.post('/category',  addCategory);
router.delete('/category/:id', removeCategory); 
router.post('/subcategory',  addSubcategory);
router.get('/categories',  getCategories);
router.get('/subcategories/:categoryId',  getSubcategories);
router.get('/subcategories', getAllSubcategories); 
router.delete('/subcategory/:id', removeSubcategory);

module.exports = router;
