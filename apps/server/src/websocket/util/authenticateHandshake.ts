import { AuthService } from "../../services/authService";

import { UserAttributes } from "../../database/models/user";
import { UserRepository } from "../../repositories/userRepository";

export const authenticateHandshake = async (
	jwt: string
): Promise<UserAttributes | null> => {
	if (!jwt) return null;

	const claims = AuthService.authenticate(jwt);
	if (!claims) return null;

	const userRepository = new UserRepository();
	const user = await userRepository.getUserById(claims.userId);
	return user;
};
