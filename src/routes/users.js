const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/sign_up', userController.signUp);
router.post('/users/create', userController.create);
router.get('/users/sign_in', userController.signIn);
router.post('/users/login', userController.login);
router.get('/users/logout', userController.logout);

module.exports = router;
