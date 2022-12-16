import { RegisterRequest } from "models/auth/registerRequest";
import { AuthResponse } from "models/auth/authResponse";
import { AuthRequest } from "models/auth/authRequest";

import { Router } from "express";
import { AuthService } from "../../services/authService";

const authRouter = Router();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

authRouter.post<{}, {}, RegisterRequest>("/register", async (req, res) => {
	const constantTime = delay(200);
	try {
		const authService = new AuthService();
		const response: AuthResponse = await authService.register(req.body);
		await constantTime;
		res.status(response.complete ? 200 : 400).send(response);
	} catch (error) {
		console.error(error);
		await constantTime;
		res.status(500).send("Internal server error");
	}
});

authRouter.post<{}, {}, AuthRequest>("/login", async (req, res) => {
	try {
		const authService = new AuthService();
		const response: AuthResponse = await authService.login(req.body);
		res.status(response.complete ? 200 : 400).send(response);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default authRouter;
