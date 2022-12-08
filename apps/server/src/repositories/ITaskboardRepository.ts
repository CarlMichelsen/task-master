import { Taskboard } from "../models/Taskboard";

export interface ITaskboardRepository {
	getById(id: string): Promise<Taskboard | null>;
	getByOwnerId(ownerId: string): Promise<Taskboard | null>;
	getByUri(uri: string): Promise<Taskboard | null>;
	getByName(name: string): Promise<Taskboard | null>;
	upsert(input: Taskboard): Promise<boolean>;
	delete(id: string): Promise<boolean>;
	allTaskboards(): Promise<Taskboard[]>;
}
