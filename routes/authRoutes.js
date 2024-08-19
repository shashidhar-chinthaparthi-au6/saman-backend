const express = require('express');
const { signup, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});


module.exports = router;
