const express = require('express');
const formidable = require('express-formidable');
const productController = require('../controllers/productController');
const { isAdmin, requireSignIn } = require('../midlleman/authMiddle');

const router = express.Router();

router.post(
    '/add-product',
    requireSignIn,
    isAdmin,
    formidable(),
    productController.createProductController,
);

router.get('/get-product', productController.getProductController);

router.get('/get-product/:slug', productController.getSingleProductController);

router.get('/product-photo/:pid', productController.productPhotoController);

router.delete('/delete-product/:pid', productController.deleteProductController);

router.put(
    '/update-product/:pid',
    requireSignIn,
    isAdmin,
    formidable(),
    productController.updateProductController
);

router.get('/braintree/token', productController.braintreeTokenController);
router.post('/braintree/payment', requireSignIn, productController.braintreePaymentController);
module.exports = router;
