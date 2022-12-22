import axios from "axios";
import type { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
import type { ServiceResponse } from "data-transfer-interfaces/serviceResponse";
import type { CreateTaskboardRequest } from "data-transfer-interfaces/taskboard/createTaskboardRequest";

export class TaskboardService {
	static async getUserTaskboards(): Promise<
		ServiceResponse<ClientTaskboard[]>
	> {
		const taskboardResponse = await axios.get<
			ServiceResponse<ClientTaskboard[]>
		>("/api/v1/taskboard/");
		return taskboardResponse.data;
	}

	static async getTaskboardByUri(
		uri: string
	): Promise<ServiceResponse<ClientTaskboard>> {
		const taskboardResponse = await axios.get<ServiceResponse<ClientTaskboard>>(
			`/api/v1/taskboard/${uri}`
		);
		return taskboardResponse.data;
	}

	static async createTaskboard(
		createRequest: CreateTaskboardRequest
	): Promise<ServiceResponse<ClientTaskboard>> {
		const taskboardResponse = await axios.post<
			ServiceResponse<ClientTaskboard>
		>("/api/v1/taskboard/", createRequest);
		return taskboardResponse.data;
	}

	static async deleteTaskboard(
		taskboardUri: string
	): Promise<ServiceResponse<string>> {
		const taskboardResponse = await axios.delete<ServiceResponse<string>>(
			`/api/v1/taskboard/${taskboardUri}`
		);
		return taskboardResponse.data;
	}
}
