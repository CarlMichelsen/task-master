import { User } from "../models/User";

export interface IUserRepository {
	getById(id: string): Promise<User | null>;
	getByTaskboardId(id: string): Promise<User[]>;
	getByName(name: string): Promise<User | null>;
	upsert(input: User): Promise<boolean>;
	delete(id: string): Promise<boolean>;
	allUsers(): Promise<User[]>;
}
