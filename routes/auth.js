const express = require('express');
const { check, body } = require('express-validator')

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please Enter a valid email'),
    ],
    authController.postLogin
);

router.post(
    '/signup',
    [

        check('email')
            .isEmail()
            .withMessage('Please Enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-mail exists already. please check it and try again.')
                        }
                    })
            }),
        body('name')
            .isEmpty()
            .withMessage('Name can\'t be empty'),
        body('password', 'Password length must be at least 8 characters')
            .isLength({ min: 8 }),
        body('passwordConfirmation')
            .equals(body('password'))
            .withMessage('Password confirmation must match password')

    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getResetPassword);
router.post('/new-password', authController.postResetPassword);

module.exports = router;