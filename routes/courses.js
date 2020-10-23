const express = require('express');

// Construct a router instance.
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const authenticateUser = require('../utils/auth');
const asyncHandler = require('./utils');
const MissingFieldException = require('../utils/exceptions');

/**
 *  GET method that retrieves a list of courses with its related students
 */
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: {
          model: User,
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId']
        }
      });
    res.json(courses);
}));


/**
 * GET method that retrieve an specific course with its related student
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId']
      }
    })
    if (course) {
        res.json(course)
    } else {
        res.status(404).json({ "Error": "Not found" }); 
    }
}));

/**
 * POST method that creates a new course
 */
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.create(req.body)
  res.status(201).set({
    location: `/api/courses/${course.id}`
  }).end()
}));

/**
 * PUT method that edits an specific course
 */
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  let course = await Course.findByPk(req.params.id)
  if (course) {
    const user = await User.findByPk(course.userId)
    if (req.currentUser.id === user.id) {
      if (req.body.title == null) {
        throw new MissingFieldException('title')
      }
      if (req.body.description == null) {
        throw new MissingFieldException('title')
      }
      await course.update(req.body);
      res.status(204).json()
    } else {
      res.status(403).json({"Error": "Permissions required"})
    }
  } else {
    res.status(400).json({"Error": "Not found"})
  }
}))


/**
 * DELETE method that destroys a course
 */
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    const user = await User.findByPk(course.userId)
    if (req.currentUser.id === user.id) {
      await course.destroy();
      res.status(204).json()
    } else {
      res.status(403).json({"Error": "Permissions required"})
    }
  } else {
    res.status(404).json({"Error": "Not found"})
  }
}))

module.exports = router;
