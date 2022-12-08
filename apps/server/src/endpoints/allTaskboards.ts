import express from "express";
import { TaskboardRepository } from "../repositories/TaskboardRepository";

export default async (req: express.Request, res: express.Response) => {
	console.log("allTaskboards");
	const repo = new TaskboardRepository();
	const allBoards = await repo.allTaskboards();
	res.send(allBoards);
};
