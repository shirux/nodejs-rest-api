const express = require('express');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('../utils/auth');

// Construct a router instance.
const router = express.Router();
const User = require('../models').User;

/**
 * Util Function taken from treehouse examples
 */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/**
 * GET route to retrieve a list of all users
 */
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const users = await User.findAll({
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
 user.password = bcryptjs.hashSync(user.password);
 
 // Create and return a 201
 await User.create(user)
 res.status(201).json(user)
}));

module.exports = router;
