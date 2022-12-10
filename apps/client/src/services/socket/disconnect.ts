import { AuthService } from "../authService";

export const disconnect = () => {
	console.log("disconnected");
	AuthService.user = null;
	AuthService.setLocalIdentity(null);
	AuthService.reportAuthChange(AuthService.user);
};
