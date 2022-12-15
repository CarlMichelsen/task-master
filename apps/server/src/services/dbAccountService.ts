import { Account, AccountAttributes } from "../database/models/account";

export class DbAccountService {
	async getAccountById(id: string): Promise<AccountAttributes | null> {
		const res = await Account.findByPk(id);
		return res?.dataValues ?? null;
	}

	async getAccountByEmail(email: string): Promise<AccountAttributes | null> {
		const res = await Account.findOne({ where: { email } });
		return res?.dataValues ?? null;
	}

	async createAccount(account: AccountAttributes): Promise<boolean> {
		try {
			const res = await Account.create(account);
			return true;
		} catch (error) {
			console.error("createAccount", error);
			return false;
		}
	}
}
