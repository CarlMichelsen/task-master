import { AuthRequest } from "models/auth/authRequest";
import { AuthResponse } from "models/auth/authResponse";
import { ClientUserService } from "../../../services/ClientUserService";
import { IClientUserService } from "../../../services/IClientUserService";

export const connect = async (
	authRequest: AuthRequest
): Promise<AuthResponse> => {
	const clientUserService: IClientUserService = new ClientUserService();
	if (authRequest.id) {
		const clientUser = await clientUserService.getClientUserById(
			authRequest.id
		);
		if (clientUser) {
			const res: AuthResponse = {
				authenticated: true,
				clientUser,
			};
			return res;
		}
	}

	if (authRequest.username) {
		const clientUser = await clientUserService.createUser(
			authRequest.username,
			authRequest.taskboardUrl
		);
		if (clientUser) {
			const res: AuthResponse = {
				authenticated: true,
				clientUser,
			};
			return res;
		}
	}

	const failure: AuthResponse = {
		authenticated: false,
		clientUser: null,
	};
	return failure;
};
