import { AccountRepository } from "../repositories/accountRepository";
import { UserRepository } from "../repositories/userRepository";
import { TaskboardService } from "./taskboardService";

export class AdministrationService {
	private readonly taskboardService = new TaskboardService();
	private readonly accountRepository = new AccountRepository();
	private readonly userRepository = new UserRepository();

	public async deleteAccountByUserId(userId: string): Promise<void> {
		const user = await this.userRepository.getUserById(userId);
		if (!user) throw new Error("User does not exist");

		const account = await this.accountRepository.getAccountById(
			user.account_id
		);
		if (!account) throw new Error("Account does not exist");

		const taskboards = await this.taskboardService.getUserTaskboards(userId);
		for (let taskboard of taskboards) {
			const left = await this.taskboardService.leaveTaskboard(
				taskboard.id,
				userId
			);
			if (!left) {
				const str = `Failed to leave taskboard<${taskboard.id}> before deleting account.`;
				throw new Error(str);
			}
		}

		const deletedUser = await this.userRepository.deleteUserById(user.id);
		if (!deletedUser) throw new Error(`Failed to delete user <${user.id}>`);

		const deletedAccount = await this.accountRepository.deleteAccountById(
			account.id
		);

		if (!deletedAccount)
			throw new Error(`Failed to delete account <${account.id}>`);
	}
}
