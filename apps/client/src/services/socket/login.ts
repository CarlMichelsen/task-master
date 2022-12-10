import type { AuthResponse } from "models/auth/authResponse";
import type { LocalIdentity } from "../../models/localIdentity";
import { AuthService } from "../authService";

export const login = (authResponse: AuthResponse) => {
	console.log("login", authResponse.authenticated);
	if (authResponse.authenticated) {
		const identity: LocalIdentity = {
			userId: authResponse.clientUser.id,
		};
		AuthService.user = authResponse.clientUser;
		AuthService.setLocalIdentity(identity);
		AuthService.reportAuthChange(AuthService.user);
	}
};
