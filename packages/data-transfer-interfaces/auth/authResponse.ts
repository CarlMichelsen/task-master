import type { ClientUser } from "../user/clientUser";

export interface AuthResponse {
	complete: boolean;
	errors: string[];
	jwt: string | null;
	user: ClientUser | null;
}
