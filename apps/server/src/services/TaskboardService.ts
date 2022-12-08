import { ITaskboardRepository } from "../repositories/ITaskboardRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { TaskboardRepository } from "../repositories/TaskboardRepository";
import { UserRepository } from "../repositories/UserRepositories";

import { ITaskboardService } from "./ITaskboardService";
import { Taskboard } from "../models/Taskboard";

import { v4 as uuidv4 } from "uuid";

export class TaskboardService implements ITaskboardService {
	taskboardRepository: ITaskboardRepository;
	userRepository: IUserRepository;

	constructor() {
		this.taskboardRepository = new TaskboardRepository();
		this.userRepository = new UserRepository();
	}

	async createTaskboard(
		name: string,
		ownerId: string
	): Promise<Taskboard | null> {
		const ownerOccupied = await this.taskboardRepository.getByOwnerId(ownerId);
		if (ownerOccupied) {
			const ownerFree = await this.safelyDeleteTaskboard(ownerOccupied.id);
			if (!ownerFree)
				throw new Error(
					"Failed to delete previous taskboard for the owner of this new taskboard."
				);
		}
		const taskboard = new Taskboard(uuidv4(), name, ownerId);
		const success = await this.taskboardRepository.upsert(taskboard);
		if (success) return taskboard;
		return null;
	}

	async safelyDeleteTaskboard(id: string): Promise<boolean> {
		const taskboard = await this.taskboardRepository.getById(id);
		if (!taskboard) return false;
		for (const memberId of taskboard.members) {
			const member = await this.userRepository.getById(memberId);
			if (!member?.taskboardId) continue;
			member.taskboardId = null;
			const success = await this.userRepository.upsert(member);
			if (!success)
				throw new Error(
					"Failed to remove user from taskboard about to be deleted."
				);
		}
		return await this.taskboardRepository.delete(id);
	}
}
