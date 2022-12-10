import type { LocalIdentity } from "../models/localIdentity";
import type { ClientUser } from "models/user/clientUser";
import type { AuthRequest } from "models/auth/authRequest";

import { readCookie, createCookie } from "../util/cookie";
import { WebsocketService } from "./websocketService";

export class AuthService {
	static user: ClientUser | null = null;
	private static authChange = new Map<
		string,
		(user: ClientUser | null) => void
	>();

	public static getLocalIdentity(): LocalIdentity | null {
		const identityCookieString = readCookie("identity");
		if (!identityCookieString) return null;
		const identity = JSON.parse(identityCookieString);
		return identity;
	}

	public static setLocalIdentity(
		identity: LocalIdentity,
		timeoutDays: number = 14
	): void {
		const identityString = JSON.stringify(identity);
		createCookie("identity", identityString, timeoutDays);
	}

	static async authorize(
		username: string | null = null,
		taskboardUrl: string | null = null
	): Promise<void> {
		const identity = this.getLocalIdentity();
		const authRequest: AuthRequest = {
			id: identity?.userId ?? null,
			username,
			taskboardUrl,
		};
		console.log("auth attempt:", authRequest);
		WebsocketService.connect(authRequest);
	}

	static logout() {
		WebsocketService.disconnect();
		AuthService.reportAuthChange(null);
	}

	public static listen(
		name: string,
		action: (user: ClientUser | null) => void
	) {
		AuthService.authChange.set(name, action);
	}

	public static delete(name: string) {
		AuthService.authChange.delete(name);
	}

	public static reportAuthChange(user: ClientUser | null) {
		this.authChange.forEach((authFunction) => authFunction(user));
	}
}
