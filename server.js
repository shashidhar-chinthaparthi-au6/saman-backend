const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to the database
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const categoryRoutes = require("./routes/categoryRoutes")

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(morgan('dev')); // HTTP request logger
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);  // Mount admin routes
app.use('/api/v1/users', userRoutes);  // Mount user routes
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
