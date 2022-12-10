import { ClientUser } from "../user/clientUser";

export interface AuthResponse {
	authenticated: boolean;
	clientUser: ClientUser | null;
}
