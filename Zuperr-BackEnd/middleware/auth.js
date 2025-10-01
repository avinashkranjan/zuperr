const jwt = require('jsonwebtoken');
const User = require('../model/employee/employee');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        verified.token = token;
        req.user = verified; // Attach user data to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

const validateUserId = async (req, res, next) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({
            error: 'User ID is required'
        });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            error: 'Invalid User ID',
            message: 'User ID must be a valid MongoDB ObjectId'
        });
    }
    
    const userExists = await User.findById(userId);
    
    if (!userExists) {
        return res.status(404).json({
            error: 'User not found',
            message: `No user found with ID: ${userId}`
        });
    }
    
    // If all validations pass, proceed to next middleware/controller
    req.validatedUserId = userId;
    
    next();
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
        return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
};

const imageFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return cb(new Error('Only image files (jpg, jpeg, png) are allowed'), false);
    }
    cb(null, true);
};

const certificationFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.pdf', '.doc', '.jpg', '.jpeg', '.png'].includes(ext)) {
        return cb(new Error('Only image (jpg, jpeg, png), PDF or Docs are allowed'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });
const uploadImage = multer({ storage, fileFilter: imageFileFilter });
const uploadCertification = multer({ storage, fileFilter: certificationFileFilter });

module.exports = {
    authenticateToken,
    validateUserId,
    upload,
    uploadImage,
    uploadCertification
};
