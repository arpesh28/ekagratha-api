import { Router } from "express";
import {
  createPersonalTaskController,
  getPersonalTaskController,
  updatePersonalTaskController,
  deletePersonalTaskController
} from "../controllers/task.controller";
import {
  validateTaskBody
} from "../middlewares/bodyValidation.middleware";
import userMiddleware from "../middlewares/auth.middleware";

const router = Router();
//Personal task
router.post('/create-task', userMiddleware, validateTaskBody, createPersonalTaskController)
router.get('/', userMiddleware, getPersonalTaskController)
router.patch('/:taskId', userMiddleware, validateTaskBody, updatePersonalTaskController)
router.delete('/:taskId', userMiddleware, deletePersonalTaskController)


export const personalTaskRouter = router;
