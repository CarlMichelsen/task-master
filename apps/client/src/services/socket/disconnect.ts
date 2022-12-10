import { AuthService } from "../authService";

export const disconnect = () => {
	console.log("disconnected");
	AuthService.user = null;
	AuthService.reportAuthChange(AuthService.user);
};
