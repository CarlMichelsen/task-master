import { Taskboard } from "../models/taskboard";

export interface ITaskboardRepository {
	getById(id: string): Promise<Taskboard | null>;
	getByOwnerId(ownerId: string): Promise<Taskboard | null>;
	upsert(input: Taskboard): Promise<boolean>;
	delete(id: string): Promise<boolean>;
	allTaskboards(): Promise<Taskboard[]>;
}
