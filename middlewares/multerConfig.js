// middlewares/multerConfig.js

const multer = require('multer');
const path = require('path');

// Set up storage options to save files in the current directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files in the current directory
    cb(null, './'); // Current directory
  },
  filename: function (req, file, cb) {
    // Use a unique filename to avoid overwriting files
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create multer instance with storage configuration
const upload = multer({ storage });

module.exports = upload;
