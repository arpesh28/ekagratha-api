import { Request, Response, NextFunction } from "express";

import { errorMessages } from "../constants/messages";


export default async function taskIDMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const taskId = req?.params?.taskId;
    if (!taskId) return res.json(400).json({ message: errorMessages.TASK_ID_INCORRECT })
    next();
}
