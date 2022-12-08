import { ITaskboardRepository } from "../repositories/ITaskboardRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { TaskboardRepository } from "../repositories/TaskboardRepository";
import { UserRepository } from "../repositories/UserRepositories";
import { IUserService } from "./IUserService";

import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User";

export class UserService implements IUserService {
	taskboardRepository: ITaskboardRepository;
	userRepository: IUserRepository;

	constructor() {
		this.taskboardRepository = new TaskboardRepository();
		this.userRepository = new UserRepository();
	}

	async createUser(username: string): Promise<User | null> {
		const exsisting = await this.userRepository.getByName(username);
		if (exsisting) return null;
		const user = new User(uuidv4(), username);
		const success = await this.userRepository.upsert(user);
		return success ? user : null;
	}

	safelyDeleteUser(id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
