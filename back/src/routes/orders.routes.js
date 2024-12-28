import express from 'express';
import orderController from '../controllers/orders.controller.js';

const router = express.Router();

router.post("/", orderController.create);
router.get("/", orderController.find);
router.get("/:id", orderController.findById);
router.put("/:id", orderController.updateById);
router.delete("/:id", orderController.deleteById);

export default router;