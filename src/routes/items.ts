import { Router } from 'express';
import * as controller from '../controllers/items';
import authHandler from '../middlewares/auth';

const router = Router();

router.get('/', controller.allItems);
router.get('/$id', controller.viewItem);

router.post('/add', authHandler, controller.addItem);
router.delete('/delete', authHandler, controller.deleteItem);

export default router;