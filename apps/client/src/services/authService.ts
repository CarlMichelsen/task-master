import axios from "axios";
import { readCookie, createCookie, eraseCookie } from "../util/cookie";
import type { AuthResponse } from "models/auth/authResponse";
import type { AuthRequest } from "models/auth/authRequest";

export class AuthService {
	private static jwtString: string | null;
	public static get jwt(): string | null {
		if (!this.jwtString) this.jwtString = readCookie("jwt") || null;
		return this.jwtString;
	}
	public static onStateChange: (jwt: string | null) => void = (jwt: string) => {
		console.log("default auth change function triggered");
	};

	private static registerJwt(jwt: string) {
		createCookie("jwt", jwt, 14);
		this.jwtString = jwt;
		this.onStateChange(jwt);
	}

	public static async login(
		email: string,
		password: string
	): Promise<AuthResponse> {
		const loginRequest: AuthRequest = { email, password };
		const res = await axios.post<AuthResponse>(
			"/api/v1/auth/login",
			loginRequest
		);
		if (res.status !== 200 && res.status !== 400)
			console.error("Error during login");

		if (res.data.complete && res.data.jwt) this.registerJwt(res.data.jwt);
		return res.data;
	}

	public static logout() {
		eraseCookie("jwt");
		this.jwtString = null;
		this.onStateChange(null);
	}
}
