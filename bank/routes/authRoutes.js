const express = require('express');
const authController = require('../controller/authController');
const {requireSignIn} = require('../middlewares/authMiddlewares');
const formidable = require('express-formidable');

const router = express.Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.get('/test',requireSignIn, authController.testController );

router.get('/get-account/:email',requireSignIn, authController.getAccountInfo);
router.put('/reduce-user/:email',formidable(), authController.reduceUserAccount);
router.put('/increase-user/:email',formidable(), authController.increaseUserAccount);

module.exports= router;