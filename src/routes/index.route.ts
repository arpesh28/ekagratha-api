import { Express, Router } from "express";
import { authRouter } from "./auth.route";
import { personalTaskRouter } from "./task.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/personal-task", personalTaskRouter);

export const rootRouter = router;
