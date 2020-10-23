const express = require('express');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('../utils/auth');
const asyncHandler = require('./utils');

// Construct a router instance.
const router = express.Router();
const User = require('../models').User;


/**
 * GET route to retrieve a list of all users
 */
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findByPk(req.currentUser.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password']
      }
    });
    res.json(users);
}));


/**
 * POST route to create a new user
 */
router.post('/', asyncHandler(async (req, res) => {
 // Grab user and hash password
 const user = req.body;
 if (user.password) {
  user.password = bcryptjs.hashSync(user.password);
 }
 
 // Create and return a 201
 await User.create(user)
 res.status(201).json(user)
}));

module.exports = router;
