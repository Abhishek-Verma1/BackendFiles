import { check } from 'express-validator';

export const registerValidation = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('name').optional().isString().withMessage('Name must be a string'),
];

export const loginValidation = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').not().isEmpty().withMessage('Password is required'),
];
