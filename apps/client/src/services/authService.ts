import axios from "axios";
import { readCookie, createCookie, eraseCookie } from "../util/cookie";
import type { AuthResponse } from "models/auth/authResponse";
import type { AuthRequest } from "models/auth/authRequest";
import type { RegisterRequest } from "models/auth/registerRequest";
import type { ClientData } from "../models/clientData";
import { AuthState } from "../models/authState";

export class AuthService {
	private static privateClientData: ClientData = {
		authState: AuthState.LoggedOut,
		jwt: null,
		user: null,
	};

	public static get clientData() {
		return this.privateClientData;
	}

	private static jwtString: string | null = null;
	public static get jwt(): string | null {
		if (!this.jwtString) this.jwtString = readCookie("jwt") || null;
		this.registerJwt(this.jwtString);
		return this.jwtString;
	}

	public static set onStateChange(
		action: (newClientData: ClientData) => Promise<void> | null
	) {
		this.stateChangeAction = action;
	}

	public static async login(
		email: string,
		password: string
	): Promise<AuthResponse> {
		const loginRequest: AuthRequest = { email, password };

		this.registerClientData(this.authorizingClientData);

		try {
			const res = await axios.post<AuthResponse>(
				"/api/v1/auth/login",
				loginRequest
			);
			this.registerClientData(this.authResponseToClientData(res.data));
			return res.data;
		} catch (error) {
			this.registerClientData(this.loggedOutClientData);
		}
	}

	public static async authorize(): Promise<void> {
		this.jwt; // trigger getter to check localstorage
		this.registerClientData(this.loggedOutClientData);
		if (!this.jwt) return;

		this.registerClientData(this.authorizingClientData);

		try {
			const res = await axios.get<AuthResponse>("/api/v1/auth/");
			this.registerClientData(this.authResponseToClientData(res.data));
		} catch (error) {
			this.registerClientData(this.loggedOutClientData);
		}
	}

	public static async register(
		username: string,
		fullname: string,
		email: string,
		password: string
	): Promise<AuthResponse> {
		const registerRequest: RegisterRequest = {
			username,
			fullname,
			email,
			password,
		};

		this.registerClientData(this.authorizingClientData);

		try {
			const res = await axios.post<AuthResponse>(
				"/api/v1/auth/register",
				registerRequest
			);
			this.registerClientData(this.authResponseToClientData(res.data));
			return res.data;
		} catch (error) {
			console.log(error);
			this.registerClientData(this.loggedOutClientData);
		}
	}

	public static logout() {
		this.registerClientData(this.authResponseToClientData(null));
		this.registerJwt(null);
	}

	public static async deleteAccount(): Promise<void> {
		try {
			const res = await axios.delete<boolean>("/api/v1/auth/");
			if (res.data) {
				this.registerClientData(this.authResponseToClientData(null));
				this.registerJwt(null);
			}
		} catch (error) {
			console.error("An error occured while deleting your account");
		}
	}

	private static authResponseToClientData(
		authResponse: AuthResponse | null
	): ClientData {
		if (!authResponse)
			return {
				authState: AuthState.LoggedOut,
				jwt: null,
				user: null,
			};

		return {
			authState: authResponse.complete
				? AuthState.LoggedIn
				: AuthState.LoggedOut,
			jwt: authResponse.jwt,
			user: authResponse.user,
		};
	}

	private static stateChangeAction: (
		newClientData: ClientData
	) => Promise<void> | null = null;

	private static registerJwt(jwt: string | null) {
		if (jwt) {
			createCookie("jwt", jwt, 7);
			axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
		} else {
			eraseCookie("jwt");
			axios.defaults.headers.common["Authorization"] = undefined;
		}
		this.jwtString = jwt;
	}

	private static registerClientData(clientData: ClientData) {
		if (clientData.authState === AuthState.LoggedIn) {
			this.registerJwt(clientData.jwt);
		}

		this.privateClientData = clientData;
		this.stateChangeAction && this.stateChangeAction(this.privateClientData);
	}

	private static readonly authorizingClientData = {
		authState: AuthState.Authorizing,
		jwt: null,
		user: null,
	};

	private static readonly loggedOutClientData = {
		authState: AuthState.LoggedOut,
		jwt: null,
		user: null,
	};
}
