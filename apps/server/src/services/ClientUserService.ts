import { ClientUser } from "models/user/clientUser";
import { ITaskboardRepository } from "../repositories/ITaskboardRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { TaskboardRepository } from "../repositories/TaskboardRepository";
import { UserRepository } from "../repositories/UserRepositories";
import { IClientUserService } from "./IClientUserService";
import { IUserService } from "./IUserService";
import { UserService } from "./UserService";

export class ClientUserService implements IClientUserService {
	userRepository: IUserRepository;
	taskboardRepository: ITaskboardRepository;
	userService: IUserService;

	constructor() {
		this.userRepository = new UserRepository();
		this.taskboardRepository = new TaskboardRepository();
		this.userService = new UserService();
	}

	async getClientUserById(id: string): Promise<ClientUser | null> {
		const user = await this.userRepository.getById(id);
		if (!user) return null;
		const taskboard = user.taskboardId
			? await this.taskboardRepository.getById(user.taskboardId)
			: null;

		const clientUser: ClientUser = {
			id: user.id,
			username: user.username,
			taskboardUrl: taskboard?.uri ?? null,
		};

		return clientUser;
	}

	async createUser(
		username: string,
		taskboardUrl: string | null
	): Promise<ClientUser | null> {
		if (!username) return null;

		const user = await this.userService.createUser(username);
		if (!user) return null;

		const taskboard = taskboardUrl
			? await this.taskboardRepository.getByUri(taskboardUrl)
			: null;
		if (taskboard) user.taskboardId = taskboard.id;

		const success = await this.userRepository.upsert(user);
		if (!success) throw Error("Failed to add taskboardId to user.");

		return await this.getClientUserById(user.id);
	}
}
