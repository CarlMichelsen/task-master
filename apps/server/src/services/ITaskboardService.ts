import { Taskboard } from "../models/Taskboard";

export interface ITaskboardService {
	createTaskboard(name: string, ownerId: string): Promise<Taskboard | null>;
	safelyDeleteTaskboard(id: string): Promise<boolean>;
}
