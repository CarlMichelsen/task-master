import { ClientUser } from "data-transfer-interfaces/user/clientUser";
import { AccountRepository } from "../repositories/accountRepository";
import { UserRepository } from "../repositories/userRepository";
import { JwtClaims } from "./authService";
import { TaskboardService } from "./taskboardService";
import { mapToClientUser } from "../mappers/clientUserMapper";
import { UserAttributes } from "../database/models/user";
import { AccountAttributes } from "../database/models/account";

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

	public async getPrivateClientUser(
		claims?: JwtClaims,
		userInput?: UserAttributes,
		accountInput?: AccountAttributes
	): Promise<ClientUser> {
		const userPromise = userInput
			? new Promise<UserAttributes>((resolve) => resolve(userInput))
			: this.userRepository.getUserById(claims?.userId ?? "");

		const accountPromise = accountInput
			? new Promise<AccountAttributes>((resolve) => resolve(accountInput))
			: this.accountRepository.getAccountById(claims?.accountId ?? "");

		const user = await userPromise;
		if (!user) throw new Error("Could not find user");
		const account = await accountPromise;
		if (!account) throw new Error("Could not find account");

		const simpleClientUser = mapToClientUser(user);
		simpleClientUser.accountData = {
			fullName: account.fullname,
			email: account.email,
			emailVerified: account.email_verified,
		};

		return simpleClientUser;
	}
}
