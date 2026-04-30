import { body, validationResult } from 'express-validator';

const validateSignup = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('first name must be under 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('last name must be under 50 characters'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('username must be between 3 and 20 characters')
    .isAlphanumeric()
    .withMessage('username can only contain letters and numbers'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('must be a valid email'),

  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('passwords do not match');
      }
      return true;
    }),
];

const validateLogin = [
  body('username').trim().notEmpty().withMessage('username is required'),

  body('password').notEmpty().withMessage('password is required'),
];

export { validateSignup, validateLogin };
