import { Client } from "pg";
import { Configuration } from "../configuration";
import { IUserRepository } from "./IUserRepository";
import { User } from "../models/User";

export class UserRepository implements IUserRepository {
	static users: Map<string, User> = new Map<string, User>();

	async getById(id: string): Promise<User | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		return UserRepository.users.get(id) ?? null;
	}

	async getByTaskboardId(id: string): Promise<User[]> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list.filter((usr) => usr.taskboardId === id);
	}

	async getByName(name: string): Promise<User | null> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list.find((usr) => usr.username === name) ?? null;
	}

	async upsert(input: User): Promise<boolean> {
		const client = await this.connection();
		console.log("database host", client.host);

		try {
			UserRepository.users.set(input.id, input);
		} catch {
			return false;
		}
		return true;
	}

	async delete(id: string): Promise<boolean> {
		const client = await this.connection();
		console.log("database host", client.host);

		return UserRepository.users.delete(id);
	}

	async allUsers(): Promise<User[]> {
		const client = await this.connection();
		console.log("database host", client.host);

		const list = Array.from(UserRepository.users).map((x) => x[1]);
		return list;
	}

	private async connection(): Promise<Client> {
		const client = new Client(Configuration.databaseUrl);
		await client.connect();
		return client;
	}
}
