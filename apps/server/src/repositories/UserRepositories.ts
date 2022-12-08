import { User } from "../models/user";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
	static users: Map<string, User> = new Map();

	async getById(id: string): Promise<User | null> {
		return UserRepository.users.get(id) ?? null;
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
