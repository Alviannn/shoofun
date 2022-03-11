import { Router } from 'express';
import {
    newProductSchema,
    idProductSchema
} from '../validations/product.validation';

import authHandler from '../middlewares/auth.middleware';
import validateHandler from '../middlewares/validate.middleware';
import * as controller from '../controllers/products.controller';

const router = Router();

router.get('/', controller.getAllProducts);

router.get('/:productId',
    validateHandler(idProductSchema, true),
    controller.getProduct
);
router.post('/add',
    authHandler,
    validateHandler(newProductSchema),
    controller.addProduct
);
router.delete('/delete/:productId',
    authHandler,
    validateHandler(idProductSchema, true),
    controller.deleteProduct
);

export default router;