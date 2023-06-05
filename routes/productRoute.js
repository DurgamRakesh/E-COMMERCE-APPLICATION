import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, getProductController, getSingleProduct, paymentController, productCategoryController, productCountController, productDeleteController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, tokenController, updateProductController } from '../controller/productController.js';
import ExpressFormidable from 'express-formidable';
const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,ExpressFormidable(),createProductController);
router.get('/get-product',getProductController);
router.get('/get-product/:slug',getSingleProduct);
router.get('/product-photo/:pid',productPhotoController);
router.delete('/delete-product/:pid',productDeleteController);
router.put('/update-product/:pid',requireSignIn,isAdmin,ExpressFormidable(),updateProductController);
router.post('/product-filters',productFilterController);
router.get('/product-count',productCountController);
router.get('/product-list/:page',productListController);
router.get('/search/:keyword',searchProductController);
router.get('/related-product/:pid/:cid',relatedProductController)
router.get('/product-category/:slug',productCategoryController)

router.get('/token',tokenController)
router.post('/payment',requireSignIn,paymentController)
export default router