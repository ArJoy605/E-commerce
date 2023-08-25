const express = require('express');
const authorization = require('../controllers/authorization');
const { requireSignIn, isAdmin } = require('../midlleman/authMiddle');

const router = express.Router();

router.post('/register', authorization.register);
router.post('/login', authorization.loginController);

router.get('/test', requireSignIn, isAdmin, authorization.testController);

// protected
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// protected
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

router.get('/orders', requireSignIn, authorization.getOrdersController);
router.get('/all-orders', requireSignIn, isAdmin, authorization.getAllOrdersController);
router.put('/order-status/:orderId', requireSignIn, isAdmin, authorization.orderStatusController);


module.exports = router;
