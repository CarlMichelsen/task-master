import { Account } from "../database/models/account";
import { User, UserAttributes } from "../database/models/user";

export class DbUserService {
	async getUserById(id: string): Promise<UserAttributes | null> {
		const res = await User.findByPk(id);
		return res?.dataValues ?? null;
	}

	async createUser(user: UserAttributes): Promise<void> {
		if (!user.account_id)
			throw new Error("Attempted to create a user without an account_id");
		const account = await Account.findByPk(user.account_id);

		if (!account)
			throw new Error("Attempted to create a user without an existing account");

		await User.create(user);
	}
}
