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

		const res = await axios.post<AuthResponse>(
			"/api/v1/auth/login",
			loginRequest
		);

		if (res.status !== 200 && res.status !== 400)
			console.error("Error during login");

		if (res.data.complete) {
			const jwt = res.data.jwt;
			if (!jwt) throw new Error("Completed auth request but there is no jwt");
			this.registerClientData(this.authResponseToClientData(res.data));
		} else {
			this.registerClientData(this.loggedOutClientData);
		}

		return res.data;
	}

	public static async authorize(): Promise<void> {
		this.jwt; // trigger getter to check localstorage
		if (!this.jwt) return;

		this.registerClientData(this.authorizingClientData);

		const res = await axios.post<AuthResponse>("/api/v1/auth/self");
		this.registerClientData(this.authResponseToClientData(res.data));
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

		this.registerClientData(this.authorizingClientData);

		const res = await axios.post<AuthResponse>(
			"/api/v1/auth/register",
			registerRequest
		);

		if (res.status !== 200 && res.status !== 400)
			console.error("Error during registration");

		if (res.data.complete) {
			const jwt = res.data.jwt;
			if (!jwt) throw new Error("Completed auth request but there is no jwt");
			this.registerClientData(this.authResponseToClientData(res.data));
		} else {
			this.registerClientData(this.loggedOutClientData);
		}
	}

	public static logout() {
		this.registerClientData(this.authResponseToClientData(null));
		this.registerJwt(null);
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
		this.jwtString =
			clientData.authState === AuthState.LoggedIn ? clientData.jwt : null;
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
