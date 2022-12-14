import { User, UserAttributes } from "../database/models/user";

export class UserRepository {
	async getUserById(id: string): Promise<UserAttributes | null> {
		const res = await User.findByPk(id);
		return res?.dataValues ?? null;
	}

	async getUserByAccountId(id: string): Promise<UserAttributes | null> {
		const res = await User.findOne({ where: { account_id: id } });
		return res?.dataValues ?? null;
	}

	async deleteUserById(id: string): Promise<boolean> {
		try {
			const rows = await User.destroy({ where: { id } });
			return rows > 0;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async usernameExists(username: string): Promise<boolean> {
		const res = await User.findOne({ where: { username } });
		return !!res;
	}

	async createUser(user: UserAttributes): Promise<boolean> {
		try {
			await User.create(user);
			return true;
		} catch (error) {
			console.error("createUser", error);
			return false;
		}
	}
}
