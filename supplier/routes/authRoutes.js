const express = require('express');
const authController = require('../controller/authController');
const {requireSignIn} = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.get('/test',requireSignIn, authController.testController );


router.get('/all-orders', authController.getAllOrdersController);
router.put('/order-status/:orderId', authController.orderStatusController);



module.exports= router;