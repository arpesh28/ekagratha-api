import { Request, Response } from "express";
import { Task } from "../models/Task.model";
import { errorMessages, successMessages } from "../constants/messages";
import { User } from "../models/User.model";

// Create Personal Task
const createPersonalTaskController = async (req: Request, res: Response) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            userId: req.body.user._id,
            status: req.body.status
        });

        // Update user document to add task ID to personalTasks array
        await User.findByIdAndUpdate(req.body.user._id, {
            $push: { personalTasks: task._id }
        });

        // Send a single response after creating the task and updating the user
        return res.status(200).json({
            message: successMessages.TASK_ADDED,
            data: {
                task: {
                    title: task.title,
                    _id: task._id,
                    description: task.description,
                    priority: task.priority,
                    status: task.status
                },
            },
        });
    } catch (error) {
        console.log("error", error)
        // Handle any errors that occur during task creation or user update
        return res.status(500).json({
            message: errorMessages.SOMETHING_WRONG,
        });
    }
};


// Fetch Personal Task
const getPersonalTaskController = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ userId: req?.body?.user?._id });
        if (tasks.length === 0) return res.status(404).json({ message: errorMessages.TASK_NOT_FOUND });
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
                priority: req?.body?.priority,
                status: req.body.status
            }
        });
    } catch (error) {
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
            // Remove deleted task ID from the personalTasks array of the corresponding user
            await User.findByIdAndUpdate(deletedTask.userId, {
                $pull: { personalTasks: taskId }
            });

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
