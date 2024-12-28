import express from 'express';
import productController from '../controllers/products.controller.js';

const router = express.Router();

router.post("/", productController.create);
router.get("/", productController.find);
router.get("/:id", productController.findById);
router.put("/:id", productController.updateById);
router.delete("/:id", productController.deleteById);

export default router;