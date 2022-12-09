import * as express from "express";
import { CreateTaskboardRequest } from "../dto/createTaskboardRequest";
import { TaskboardService } from "../services/TaskboardService";

export default async (req: express.Request, res: express.Response) => {
	console.log("createTaskboard");
	const taskboardService = new TaskboardService();
	const b = req.body as CreateTaskboardRequest;
	const taskboard = await taskboardService.createTaskboard(b.name, b.userId);
	res.send(taskboard);
};
