import { AuthResponse } from "../auth/authResponse";

export interface IServerToClientEvents {
	noArg: () => void;
	login: (authResponse: AuthResponse) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}
