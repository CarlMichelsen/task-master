import * as express from "express";
import { AuthRequest } from "../dto/authRequest";
import { AuthResponse } from "../dto/authResponse";
import { ClientIdentity } from "../dto/clientIdentity";
import { ClientUser } from "../dto/clientUser";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepositories";

export default async (req: express.Request, res: express.Response) => {
	console.log("auth");
	const userRepository: IUserRepository = new UserRepository();
	const authRequest = req.body as AuthRequest;
	const userId = authRequest.identity?.userId;
	if (userId) {
		const user = await userRepository.getById(authRequest.identity?.userId);
		if (user) {
			const clientUser = new ClientUser(user.username);
			clientUser.id = user.id;

			const authResponse = new AuthResponse();
			authResponse.success = true;
			authResponse.user = clientUser;
			res.send(authResponse);
		} else {
			const authResponse = new AuthResponse();
			res.send(authResponse);
		}
	} else {
		const authResponse = new AuthResponse();
		res.send(authResponse);
	}
};
