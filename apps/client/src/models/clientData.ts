import type { ClientUser } from "data-transfer-interfaces/user/clientUser";
import type { AuthState } from "./authState";

export interface ClientData {
	authState: AuthState;
	jwt: string | null;
	user: ClientUser | null;
}
