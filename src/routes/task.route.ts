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
import taskIDMiddleware from "../middlewares/task.middleware";

const router = Router();
//Personal task
router.post('/create-task', validateTaskBody, createPersonalTaskController)
router.get('/', getPersonalTaskController)
router.put('/:taskId', taskIDMiddleware, validateTaskBody, updatePersonalTaskController)
router.delete('/:taskId', taskIDMiddleware, deletePersonalTaskController)


export const personalTaskRouter = router;
