import axios from "axios";
import { readCookie, createCookie, eraseCookie } from "../util/cookie";
import { host } from "../util/host";
import type { AuthResponse } from "models/auth/authResponse";
import type { AuthRequest } from "models/auth/authRequest";
import type { RegisterRequest } from "models/auth/registerRequest";

export class AuthService {
	private static jwtString: string | null = null;
	public static get jwt(): string | null {
		if (!this.jwtString) this.jwtString = readCookie("jwt") || null;
		this.registerJwt(this.jwtString, false);
		return this.jwtString;
	}
	public static set onStateChange(
		action: (jwt: string | null, fresh: boolean) => Promise<void> | null
	) {
		this.stateChangeAction = action;
	}

	public static async login(
		email: string,
		password: string
	): Promise<AuthResponse> {
		const loginRequest: AuthRequest = { email, password };

		const res = await axios.post<AuthResponse>(
			`${host()}/api/v1/auth/login`,
			loginRequest
		);

		if (res.status !== 200 && res.status !== 400)
			console.error("Error during login");

		if (res.data.complete) {
			const jwt = res.data.jwt;
			if (!jwt) throw new Error("Completed auth request but there is no jwt");
			this.registerJwt(res.data.jwt, true);
		}

		return res.data;
	}

	public static async isAuthorized(): Promise<boolean> {
		const res = await axios
			.post<boolean>(`${host()}/api/v1/auth/valid`)
			.catch((error) => error.data);
		const authorized = res.data;
		return authorized;
	}

	public static async register(
		username: string,
		fullname: string,
		email: string,
		password: string
	) {
		const registerRequest: RegisterRequest = {
			username,
			fullname,
			email,
			password,
		};

		const res = await axios.post<AuthResponse>(
			`${host()}/api/v1/auth/register`,
			registerRequest
		);

		if (res.status !== 200 && res.status !== 400)
			console.error("Error during registration");

		if (res.data.complete) {
			const jwt = res.data.jwt;
			if (!jwt) throw new Error("Completed auth request but there is no jwt");
			this.registerJwt(res.data.jwt, true);
		}

		return res.data;
	}

	public static logout() {
		this.registerJwt(null, true);
	}

	public static forceRunStateChangeAction() {
		this.registerJwt(this.jwtString, false);
		this.stateChangeAction(this.jwt, false);
	}

	private static stateChangeAction: (
		jwt: string | null,
		fresh: boolean
	) => Promise<void> | null = null;

	private static registerJwt(jwt: string | null, fresh: boolean) {
		if (jwt != null) {
			createCookie("jwt", jwt, 14);
			axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
		} else {
			eraseCookie("jwt");
			axios.defaults.headers.common["Authorization"] = undefined;
		}
		if (jwt === this.jwtString) return; // only proceed if the jwt has actually changed
		this.jwtString = jwt;
		if (this.stateChangeAction) this.stateChangeAction(jwt, fresh);
	}
}
