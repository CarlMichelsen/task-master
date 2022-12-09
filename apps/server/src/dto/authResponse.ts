import { ClientUser } from "./clientUser";

export class AuthResponse {
	success: boolean = false;
	user: ClientUser | null = null;
}
