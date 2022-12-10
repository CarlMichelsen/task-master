import { ClientUser } from "models/user/clientUser";

export interface IClientUserService {
	getClientUserById(id: string): Promise<ClientUser | null>;
	createUser(
		username: string,
		taskboardUrl: string | null
	): Promise<ClientUser | null>;
}
