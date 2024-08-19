const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
console.log("aaaaaaaaaaaa",process.env.MONGO_URI)
mongoose.connect("mongodb://127.0.0.1:27017/saman")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));
