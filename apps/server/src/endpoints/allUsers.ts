import * as express from "express";
import { UserRepository } from "../repositories/UserRepositories";

export default async (req: express.Request, res: express.Response) => {
	console.log("allUsers");
	const repo = new UserRepository();
	const allUsers = await repo.allUsers();
	res.send(allUsers);
};
