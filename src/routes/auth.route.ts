import { Express, Request, Response, Router } from "express";
const router = Router();

router.post("/register", (req: Request, res: Response) => {
  res.json({
    message: "Hello",
  });
});

router.post("/login", (req: Request, res: Response) => {
  res.json({
    message: "Hello Log",
  });
});

export const authRouter = router;
