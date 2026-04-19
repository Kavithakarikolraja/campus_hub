const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(401).json({ message: 'Not authorized as an admin' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };
