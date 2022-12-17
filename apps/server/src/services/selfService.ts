import { ClientUser } from "models/user/clientUser";
import { UserAttributes } from "../database/models/user";
import { DbUserService } from "./dbUserService";
import type { JwtClaims } from "./authService";

export class SelfService {
	private userService = new DbUserService();

	public async getClientUserFromClaims(claims: JwtClaims): Promise<ClientUser> {
		const user = await this.userService.getUserById(claims.userId);
		if (!user)
			throw new Error(`Could not find user<${claims.userId}> from claims`);
		return this.getClientUserFromUser(user);
	}

	public getClientUserFromUser(user: UserAttributes): ClientUser {
		return {
			username: user.username,
			online: user.online,
		};
	}
}
