import { User } from "../models/User";

export interface IUserService {
	createUser(username: string): Promise<User | null>;
	safelyDeleteUser(id: string): Promise<boolean>;
}
