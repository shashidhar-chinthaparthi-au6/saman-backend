const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Sign JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Signup
exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await User.create({ name, email, password, role });
        const token = signToken(user._id);
        res.status(201).json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = signToken(user._id);
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email_verified, name, email, sub } = response.payload;

        if (email_verified) {
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name,
                    email,
                    password: sub,
                    googleId: sub,
                });
            }
            const token = signToken(user._id);
            res.status(200).json({ success: true, token, user });
        } else {
            res.status(401).json({ success: false, error: 'Google login failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
