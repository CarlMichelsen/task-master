import { User } from "../models/User";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
	static users: Map<string, User> = new Map<string, User>();

	async getById(id: string): Promise<User | null> {
		return UserRepository.users.get(id) ?? null;
	}

	async getByTaskboardId(id: string): Promise<User[]> {
		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list.filter((usr) => usr.taskboardId === id);
	}

	async getByName(name: string): Promise<User | null> {
		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list.find((usr) => usr.username === name) ?? null;
	}

	async upsert(input: User): Promise<boolean> {
		try {
			UserRepository.users.set(input.id, input);
		} catch {
			return false;
		}
		return true;
	}

	async delete(id: string): Promise<boolean> {
		return UserRepository.users.delete(id);
	}

	async allUsers(): Promise<User[]> {
		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list;
	}
}
