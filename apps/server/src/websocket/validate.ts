import { JwtClaims } from "../services/authService";

import { TaskboardService } from "../services/taskboardService";
import { TaskboardAttributes } from "../database/models/taskboard";

import { UserRepository } from "../repositories/userRepository";
import { UserAttributes } from "../database/models/user";

export const getUser = async (
	claims: JwtClaims | null
): Promise<UserAttributes | null> => {
	if (!claims) return null;

	const userRepository = new UserRepository();
	const user = await userRepository.getUserById(claims.userId);
	if (!user) return null;
	return user;
};

export const joinTaskboard = async (
	claims: JwtClaims | null,
	uri: string
): Promise<TaskboardAttributes | null> => {
	if (!claims) return null;

	const taskboardService = new TaskboardService();
	const taskboard = await taskboardService.joinTaskboardByUri(
		uri,
		claims.userId
	);
	if (!taskboard) return null;
	return taskboard;
};
