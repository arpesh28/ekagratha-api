import { Request, Response } from "express";
import { Task } from "../models/Task.model";
import { User } from "../models/User.model";

const createPersonalTaskController = async (req: Request, res: Response) => {
    const task = await Task.create({
        title: req.body.title,
        description:req.body.description,
        priority: req.body.priority,
        userId:req.body.user._id
      });
      res.json({
        data: {
            task: { title: task.title, _id: task._id, description: task.description, priority: task.priority},
        },
      });
};

const getPersonalTaskController= async(req:Request, res:Response) =>{
    const tasks= await Task.find().populate('userId');
  res.json({status:200,message:"Success",data:tasks})
}
const updatePersonalTaskController=async(req:Request, res:Response) =>{
    const taskId=req?.params?.taskId;
    const task=await Task.findOneAndUpdate({_id:taskId},{
              title: req.body.title,
              description:req.body.description,
              priority: req.body.priority,
    });
    await task?.save();
    await res.json({status:200,
        message:"Success", 
        data:{ 
            title: req?.body?.title,
             _id: taskId, 
             description: req?.body?.description, 
             priority: req?.body?.priority
            }
    })
}
const deletePersonalTaskController=async(req:Request, res:Response) =>{
    const taskId=req?.params?.taskId;
    await Task.findOneAndDelete({_id:taskId});
    await res.json({status:200,message:"Success"})
}
export { 
    createPersonalTaskController,
    getPersonalTaskController,
    updatePersonalTaskController,
    deletePersonalTaskController
};
