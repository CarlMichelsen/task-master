import { Taskboard } from "../models/Taskboard";
import { User } from "../models/User";

export interface ITaskboardService {
	createTaskboard(name: string, ownerId: string): Promise<Taskboard | null>;
	safelyDeleteTaskboard(id: string): Promise<boolean>;
}
