import { Router } from 'express';
import { newProductSchema } from '../validations/product.validation';

import authHandler from '../middlewares/auth.middleware';
import validateHandler from '../middlewares/validate.middleware';
import * as controller from '../controllers/products.controller';

const router = Router();

router.get('/', controller.getAllProducts);
router.get('/:productId', controller.getProduct);

router.delete('/delete', authHandler, controller.deleteProduct);
router.post('/add',
    authHandler,
    validateHandler(newProductSchema),
    controller.addProduct
);

export default router;