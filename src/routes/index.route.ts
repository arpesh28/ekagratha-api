import { Router } from "express";
import { authRouter } from "./auth.route";
import { personalTaskRouter } from "./task.route";
import { teamRouter } from "./team.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/personal-task", personalTaskRouter);
router.use("/team", teamRouter);

export const rootRouter = router;
