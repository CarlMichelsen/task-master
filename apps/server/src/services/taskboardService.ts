import { CreateTaskboardRequest } from "data-transfer-interfaces/taskboard/createTaskboardRequest";
import { TaskboardAttributes } from "../database/models/taskboard";
import { ServiceResponse } from "data-transfer-interfaces/serviceResponse";
import { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

import {
	mapToClientTaskboard,
	taskboardFactory,
} from "../mappers/clientTaskboardMapper";
import { TaskboardValidationService } from "./taskboardValidationService";

import { UserRepository } from "../repositories/userRepository";
import { TaskboardRepository } from "../repositories/taskboardRepository";

export class TaskboardService {
	private readonly taskboardRepository = new TaskboardRepository();
	private readonly userRepository = new UserRepository();
	private readonly validator = new TaskboardValidationService();

	public async joinTaskboard(
		taskboardId: string,
		userId: string
	): Promise<TaskboardAttributes | null> {
		return await this.taskboardRepository.joinTaskboard(taskboardId, userId);
	}

	public async joinTaskboardByUri(
		taskboardUri: string,
		userId: string
	): Promise<TaskboardAttributes | null> {
		const taskboard = await this.taskboardRepository.getTaskboardByUri(
			taskboardUri
		);
		if (!taskboard) return null;
		const joined = await this.taskboardRepository.naiveJoinTaskboard(
			taskboard.id,
			userId
		);
		return joined ? taskboard : null;
	}

	public async leaveTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const taskboard = await this.taskboardRepository.getTaskboard(taskboardId);
		if (!taskboard) return false;

		const members = await this.taskboardRepository.getTaskBoardMembers(
			taskboardId
		);
		if (members.length <= 1) {
			return await this.taskboardRepository.deleteTaskboard(taskboardId);
		} else if (taskboard.owner_id === userId) {
			try {
				const candidates = members.filter((m) => m.id !== userId);
				const candidate =
					candidates[Math.floor(Math.random() * candidates.length)];
				const newOwner = await this.taskboardRepository.setNewTaskboardOwner(
					taskboardId,
					candidate.id
				);
				if (!newOwner) throw new Error("Failed to set new owner");
			} catch (error) {
				return false;
			}
		}

		return await this.leaveTaskboard(taskboardId, userId);
	}

	public async isMember(userId: string, taskboardId: string): Promise<boolean> {
		const user = await this.userRepository.getUserById(userId);
		if (!user) return false;

		const taskboard = await this.taskboardRepository.getTaskboard(taskboardId);
		if (!taskboard) return false;

		const members = await this.taskboardRepository.getTaskBoardMembers(
			taskboard.id
		);
		return members.findIndex((u) => u.id === userId) !== -1;
	}

	public async getTaskboard(
		taskboardId: string
	): Promise<TaskboardAttributes | null> {
		return await this.taskboardRepository.getTaskboard(taskboardId);
	}

	public async getTaskboardByUri(
		uri: string
	): Promise<TaskboardAttributes | null> {
		return await this.taskboardRepository.getTaskboardByUri(uri);
	}

	public async deleteTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const taskboard = await this.taskboardRepository.getTaskboard(taskboardId);
		if (!taskboard) return false;
		if (taskboard.owner_id !== userId) return false;
		return await this.taskboardRepository.deleteTaskboard(taskboardId);
	}

	public async leaveTaskboardByUri(
		uri: string,
		userId?: string
	): Promise<ServiceResponse<string>> {
		const serviceResponse = this.baseRes<string>();
		const taskboard = await this.taskboardRepository.getTaskboardByUri(uri);

		if (!taskboard) {
			serviceResponse.ok = false;
			serviceResponse.errors.push("Taskboard not found");
			return serviceResponse;
		}

		if (!userId) {
			serviceResponse.ok = false;
			serviceResponse.errors.push("No user was supplied");
			return serviceResponse;
		}

		const left = await this.taskboardRepository.leaveTaskboard(
			taskboard.id,
			userId
		);

		serviceResponse.ok = left;
		if (left) {
			serviceResponse.data = taskboard.uri;
		} else {
			serviceResponse.errors.push("Failed to leave");
		}

		return serviceResponse;
	}

	public async deleteTaskboardByUri(
		uri: string,
		userId?: string
	): Promise<ServiceResponse<string>> {
		const serviceResponse = this.baseRes<string>();
		const taskboard = await this.taskboardRepository.getTaskboardByUri(uri);
		if (!taskboard) {
			serviceResponse.ok = false;
			serviceResponse.errors.push("Taskboard not found");
			return serviceResponse;
		}

		if (!userId) {
			serviceResponse.ok = false;
			serviceResponse.errors.push(
				"Only owner can delete taskboard and no owner was supplied"
			);
			return serviceResponse;
		}

		if (taskboard.owner_id !== userId) {
			serviceResponse.ok = false;
			serviceResponse.errors.push("Only owner can delete taskboard");
			return serviceResponse;
		}

		const deleted = await this.taskboardRepository.deleteTaskboard(
			taskboard.id
		);

		serviceResponse.ok = deleted;
		serviceResponse.data = serviceResponse.ok ? taskboard.uri : undefined;
		return serviceResponse;
	}

	public async createTaskboard(
		ownerId?: string,
		createRequest?: CreateTaskboardRequest
	): Promise<ServiceResponse<ClientTaskboard>> {
		const res = this.baseRes<ClientTaskboard>();
		const name = this.validator.attemptFixTaskboardName(
			createRequest?.taskboardName
		);
		if (!name) {
			res.ok = false;
			res.errors.push("No name was supplied");
			return res;
		}

		if (!ownerId) {
			res.ok = false;
			res.errors.push("No owner was supplied");
			return res;
		}

		const validationResult = this.validator.validateTaskboardName(name);
		if (!validationResult.ok) {
			res.ok = false;
			res.errors = res.errors.concat(validationResult.errors);
			return res;
		}

		const user = await this.userRepository.getUserById(ownerId);
		if (!user) {
			res.ok = false;
			res.errors.push("Owner does not exist");
			return res;
		}

		const newTaskboard = await taskboardFactory(ownerId, name);

		const created = await this.taskboardRepository.createTaskboard(
			ownerId,
			newTaskboard
		);

		if (!created) {
			res.ok = false;
			res.errors.push("Failed to create taskboard");
			return res;
		}

		const clientTaskboard = await mapToClientTaskboard(created);
		if (!clientTaskboard) {
			res.ok = false;
			res.errors.push("Failed client taskboard mapping");
			return res;
		}

		res.ok = true;
		res.data = clientTaskboard;
		return res;
	}

	public async getUserTaskboards(
		userId: string
	): Promise<TaskboardAttributes[]> {
		return await this.taskboardRepository.getUserTaskboards(userId);
	}

	private baseRes<T>(): ServiceResponse<T> {
		return {
			ok: false,
			errors: [],
		};
	}
}
