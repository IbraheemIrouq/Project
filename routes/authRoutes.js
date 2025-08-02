const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

//register new user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('valid email required'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) =>
    {
      if (value !== req.body.password)
      {
        throw new Error('passwords do not match');
      }
      return true;
    })
  ],
  authController.register
);

//login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('valid email required'),
    body('password').notEmpty().withMessage('password is required')
  ],
  authController.login
);


//logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'logged out' });
});

module.exports = router;
