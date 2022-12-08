import type { LocalIdentity } from "../models/localIdentity";
import type { User } from "../models/user";

import axios from "axios";
import { readCookie, createCookie } from "../util/cookie";

export class AuthService {
	static user: User | null = null;

	static getLocalIdentity(): LocalIdentity | null {
		const identityCookieString = readCookie("identity");
		if (!identityCookieString) return null;
		const identity = JSON.parse(identityCookieString);
		return identity;
	}

	static setLocalIdentity(
		identity: LocalIdentity,
		timeoutDays: number = 14
	): void {
		const identityString = JSON.stringify(identity);
		createCookie("identity", identityString, timeoutDays);
	}

	static async getIdentity(): Promise<User> {
		const localIdentity = this.getLocalIdentity();
		const response = await axios.post<User>("/auth", localIdentity);
		this.user = response.data;
		return this.user;
	}
}
