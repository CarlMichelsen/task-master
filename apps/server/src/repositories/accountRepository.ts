import { Account, AccountAttributes } from "../database/models/account";

export class AccountRepository {
	async getAccountById(id: string): Promise<AccountAttributes | null> {
		const res = await Account.findByPk(id);
		return res?.dataValues ?? null;
	}

	async getAccountByEmail(email: string): Promise<AccountAttributes | null> {
		const res = await Account.findOne({ where: { email } });
		return res?.dataValues ?? null;
	}

	async deleteAccountById(id: string): Promise<boolean> {
		try {
			const rows = await Account.destroy({ where: { id } });
			return rows > 0;
		} catch (error) {
			console.error("deleteAccountById", error);
			return false;
		}
	}

	async createAccount(account: AccountAttributes): Promise<boolean> {
		try {
			await Account.create(account);
			return true;
		} catch (error) {
			console.error("createAccount", error);
			return false;
		}
	}
}
