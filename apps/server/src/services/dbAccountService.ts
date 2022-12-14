import { Account, AccountAttributes } from "../database/models/account";

export class DbAccountService {
	async getAccountById(id: string): Promise<AccountAttributes | null> {
		const res = await Account.findByPk(id);
		return res?.dataValues ?? null;
	}
}
