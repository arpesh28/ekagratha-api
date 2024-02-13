import { Request, Response } from "express";
import { Task } from "../models/Task.model";
import { errorMessages, successMessages } from "../constants/messages";

// Create Personal Task
const createPersonalTaskController = async (req: Request, res: Response) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            userId: req.body.user._id
        });
        return res.json(200).json({
            message: successMessages.TASK_ADDED,
            data: {
                task: { title: task.title, _id: task._id, description: task.description, priority: task.priority },
            },
        })
    } catch (error) {
        return res.status(500).json({
            message: errorMessages.SOMETHING_WRONG,
        });
    }
};

// Fetch Personal Task
const getPersonalTaskController = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ userId: req?.body?.user?._id });
        if (!tasks) return res.status(404).json({ message: errorMessages.TASK_NOT_FOUND });
        return res.json(200).json({
            message: successMessages.TASK_FETCHED,
            data: tasks
        })
    } catch (error) {
        return res.status(500).json({
            message: errorMessages.SOMETHING_WRONG,
        });
    }
}

// Update Personal Task
const updatePersonalTaskController = async (req: Request, res: Response) => {
    const taskId = req?.params?.taskId;
    try {
        const task = await Task.findOneAndUpdate({ _id: taskId }, {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
        });

        if (!task) return res.status(404).json({ message: errorMessages.TASK_NOT_FOUND });
        return res.status(200).json({
            message: successMessages.TASK_UPDATED,
            data: {
                title: req?.body?.title,
                _id: taskId,
                description: req?.body?.description,
                priority: req?.body?.priority
            }
        });
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            message: errorMessages.TASK_ID_INCORRECT
        });
    }

}

// Delete Personal Task
const deletePersonalTaskController = async (req: Request, res: Response) => {
    const taskId = req?.params?.taskId;
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: taskId });
        if (deletedTask) {
            return res.status(200).json({ message: successMessages.TASK_DELETED });
        } else {
            return res.status(404).json({ message: errorMessages.TASK_ALREADY_DELETED });
        }
    } catch (error) {
        return res.status(500).json({
            message: errorMessages.TASK_ID_INCORRECT
        });
    }
}
export {
    createPersonalTaskController,
    getPersonalTaskController,
    updatePersonalTaskController,
    deletePersonalTaskController
};
