import { User } from "../models/user";

export interface IUserRepository {
	getById(id: string): Promise<User | null>;
	getByName(name: string): Promise<User | null>;
	upsert(input: User): Promise<boolean>;
	delete(id: string): Promise<boolean>;
	allUsers(): Promise<User[]>;
}
