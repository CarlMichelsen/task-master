import { Client } from "pg";
import { Configuration } from "../configuration";
import { ITaskboardRepository } from "./ITaskboardRepository";
import { Taskboard } from "../models/Taskboard";

export class TaskboardRepository implements ITaskboardRepository {
	static taskboards: Map<string, Taskboard> = new Map();

	async getById(id: string): Promise<Taskboard | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		return TaskboardRepository.taskboards.get(id) ?? null;
	}

	async getByOwnerId(ownerId: string): Promise<Taskboard | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(TaskboardRepository.taskboards);
		const item = list.find((x) => ownerId === x[1].ownerId) ?? null;
		return item?.[1] ?? null;
	}

	async getByUri(uri: string): Promise<Taskboard | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(TaskboardRepository.taskboards).map((x) => x[1]);
		return list.find((x) => x.uri === uri) ?? null;
	}

	async getByName(name: string): Promise<Taskboard | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(TaskboardRepository.taskboards).map((x) => x[1]);
		return list.find((x) => x.name === name) ?? null;
	}

	async upsert(input: Taskboard): Promise<boolean> {
		const client = await this.connection();
		console.log("database host", client.host);

		try {
			TaskboardRepository.taskboards.set(input.id, input);
		} catch {
			return false;
		}
		return true;
	}

	async delete(id: string): Promise<boolean> {
		const client = await this.connection();
		console.log("database host", client.host);

		return TaskboardRepository.taskboards.delete(id);
	}

	async allTaskboards(): Promise<Taskboard[]> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(TaskboardRepository.taskboards).map((x) => x[1]);
		return list;
	}

	private async connection(): Promise<Client> {
		const client = new Client(Configuration.databaseUrl);
		await client.connect();
		return client;
	}
}
