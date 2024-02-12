import { Router } from "express";
import { authRouter } from "./auth.route";
import { personalTaskRouter } from "./task.route";
import { teamRouter } from "./team.route";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/personal-task", personalTaskRouter);
router.use("/team", authMiddleware, teamRouter);

export const rootRouter = router;
