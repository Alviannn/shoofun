import { Router } from 'express';

import authHandler from '../middlewares/auth.middleware';
import * as controller from '../controllers/products.controller';

const router = Router();

router.get('/', controller.getAllProducts);
router.get('/:productId', controller.getProduct);

router.post('/add', authHandler, controller.addProduct);
router.delete('/delete', authHandler, controller.deleteProduct);

export default router;