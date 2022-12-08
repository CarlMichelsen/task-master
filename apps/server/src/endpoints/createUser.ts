import express from "express";
import { CreateUserRequest } from "../dto/createUserRequest";
import { UserService } from "../services/UserService";

export default async (req: express.Request, res: express.Response) => {
	console.log("createUser");
	const userService = new UserService();
	const body = req.body as CreateUserRequest;
	const user = await userService.createUser(body.username);
	res.send(user);
};
