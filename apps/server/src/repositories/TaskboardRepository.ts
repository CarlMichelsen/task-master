import { Taskboard } from "../models/taskboard";
import { ITaskboardRepository } from "./ITaskboardRepository";

export class TaskboardRepository implements ITaskboardRepository {
	static taskboards: Map<string, Taskboard> = new Map();

	async getById(id: string): Promise<Taskboard | null> {
		return TaskboardRepository.taskboards.get(id) ?? null;
	}

	async getByOwnerId(ownerId: string): Promise<Taskboard | null> {
		const list = Array.from(TaskboardRepository.taskboards);
		const item = list.find((x) => ownerId === x[1].ownerId) ?? null;
		return item?.[1] ?? null;
	}

	async upsert(input: Taskboard): Promise<boolean> {
		try {
			TaskboardRepository.taskboards.set(input.id, input);
		} catch {
			return false;
		}
		return true;
	}

	async delete(id: string): Promise<boolean> {
		return TaskboardRepository.taskboards.delete(id);
	}

	async allTaskboards(): Promise<Taskboard[]> {
		const list = Array.from(TaskboardRepository.taskboards).map((x) => x[1]);
		return list;
	}
}
