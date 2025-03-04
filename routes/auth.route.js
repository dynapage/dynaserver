const router = require('express').Router()
const userController = require('../controllers/user.controller')
const { body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const User = require('../models/user.model')

router.post(
  '/signup',
  body('name').isLength({ min: 5 }).withMessage(
    'name must be at least 8 characters'
  ),
  body('username').isLength({ min: 8 }).withMessage(
    'email must be at least 8 characters'
  ),
  body('password').isLength({ min: 8 }).withMessage(
    'password must be at least 8 characters'
  ),
  body('confirmPassword').isLength({ min: 8 }).withMessage(
    'confirmPassword must be at least 8 characters'
  ),
  body('username').custom(value => {
    return User.findOne({ username: value }).then(user => {
      if (user) {
        return Promise.reject('username already used')
      }
    })
  }),
  validation.validate,
  userController.register
)

router.post(
  '/login',
  body('username').isLength({ min: 4 }).withMessage(
    'username must be at least 8 characters'
  ),
  body('password').isLength({ min: 4 }).withMessage(
    'password must be at least 8 characters'
  ),
  validation.validate,
  userController.login
)

router.post(
  '/logininternal',
  body('username').isLength({ min: 4 }).withMessage(
    'username must be at least 8 characters'
  ),
  body('password').isLength({ min: 4 }).withMessage(
    'password must be at least 8 characters'
  ),
  validation.validate,
  userController.loginInternal
)

router.post(
  '/verify-token',
  tokenHandler.verifyToken,
  (req, res) => {
    res.status(200).json({ user: req.user })
  }
)

router.delete(
  '/deleteinternal',

  validation.validate,
  userController.loginInternal
)

module.exports = router