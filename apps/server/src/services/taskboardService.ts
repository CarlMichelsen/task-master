import { CreateTaskboardRequest } from "data-transfer-interfaces/taskboard/createTaskboardRequest";
import { TaskboardAttributes } from "../database/models/taskboard";
import { DbTaskboardService } from "./dbTaskboardService";
import { TaskboardValidationService } from "./taskboardValidationService";
import { ServiceResponse } from "data-transfer-interfaces/serviceResponse";
import {
	mapToClientTaskboard,
	taskboardFactory,
} from "../mappers/clientTaskboardMapper";
import { DbUserService } from "./dbUserService";
import { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";

export class TaskboardService {
	private readonly taskboardDb = new DbTaskboardService();
	private readonly userDb = new DbUserService();
	private readonly validator = new TaskboardValidationService();

	public async joinTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		return await this.taskboardDb.joinTaskboard(taskboardId, userId);
	}

	public async leaveTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const taskboard = await this.taskboardDb.getTaskboard(taskboardId);
		if (!taskboard) return false;

		const members = await this.taskboardDb.getTaskBoardMembers(taskboardId);
		if (members.length <= 1) {
			this.taskboardDb.deleteTaskboard(taskboardId);
			return true;
		} else if (taskboard.owner_id === userId) {
			try {
				const candidates = members.filter((m) => m.id !== userId);
				const candidate =
					candidates[Math.floor(Math.random() * candidates.length)];
				const newOwner = await this.taskboardDb.setNewTaskboardOwner(
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

	public async getTaskboard(
		taskboardId: string
	): Promise<TaskboardAttributes | null> {
		return await this.taskboardDb.getTaskboard(taskboardId);
	}

	public async deleteTaskboard(
		taskboardId: string,
		userId: string
	): Promise<boolean> {
		const taskboard = await this.taskboardDb.getTaskboard(taskboardId);
		if (!taskboard) return false;
		if (taskboard.owner_id !== userId) return false;
		return await this.taskboardDb.deleteTaskboard(taskboardId);
	}

	public async deleteTaskboardByUri(
		uri: string,
		userId?: string
	): Promise<ServiceResponse<string>> {
		const serviceResponse = this.baseRes<string>();
		const taskboard = await this.taskboardDb.getTaskboardByUri(uri);
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

		const left = await this.taskboardDb.leaveTaskboard(taskboard.id, userId);
		const deleted = await this.taskboardDb.deleteTaskboard(taskboard.id);

		serviceResponse.ok = left || deleted;
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

		const user = await this.userDb.getUserById(ownerId);
		if (!user) {
			res.ok = false;
			res.errors.push("Owner does not exist");
			return res;
		}

		const newTaskboard = await taskboardFactory(ownerId, name);

		const created = await this.taskboardDb.createTaskboard(
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
		return await this.taskboardDb.getUserTaskboards(userId);
	}

	private baseRes<T>(): ServiceResponse<T> {
		return {
			ok: false,
			errors: [],
		};
	}
}
