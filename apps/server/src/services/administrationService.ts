import { DbAccountService } from "./dbAccountService";
import { DbUserService } from "./dbUserService";

export class AdministrationService {
	private readonly accountService = new DbAccountService();
	private readonly userService = new DbUserService();

	public async deleteAccountByUserId(userId: string): Promise<void> {
		const user = await this.userService.getUserById(userId);
		if (!user) throw new Error("User does not exist");

		const account = await this.accountService.getAccountById(user.account_id);
		if (!account) throw new Error("Account does not exist");

		const deletedUser = await this.userService.deleteUserById(user.id);
		const deletedAccount = await this.accountService.deleteAccountById(
			account.id
		);

		if (!deletedUser) throw new Error(`Failed to delete user <${user.id}>`);
		if (!deletedAccount)
			throw new Error(`Failed to delete account <${account.id}>`);
	}
}
