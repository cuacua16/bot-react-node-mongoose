import express from 'express';
import userController from '../controllers/users.controller.js';

const router = express.Router();

router.post("/", userController.create);
router.get("/", userController.find);
router.get("/:id", userController.findById);
router.put("/:id", userController.updateById);
router.delete("/:id", userController.deleteById);

export default router;