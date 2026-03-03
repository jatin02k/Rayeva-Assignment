import express from 'express';
import { categorizeProduct } from '../controllers/category.controller.js';

const router = express.Router();
router.post('/', categorizeProduct);
export default router;
