import { Router, Request, Response } from "express";
import { AuthService } from "../../services/authService";
import { AdministrationService } from "../../services/administrationService";

import { RegisterRequest } from "data-transfer-interfaces/auth/registerRequest";
import { AuthResponse } from "data-transfer-interfaces/auth/authResponse";
import { AuthRequest } from "data-transfer-interfaces/auth/authRequest";
import type { ClientUser } from "data-transfer-interfaces/user/clientUser";

// middleware
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const internalErrorMessage: string = "Internal server error";

authRouter.post<{}, {}, RegisterRequest>(
	"/register",
	async (req: Request, res: Response) => {
		const constantTime = delay(500);
		try {
			const authService = new AuthService();
			const response: AuthResponse = await authService.register(req.body);
			await constantTime;
			res.status(200).send(response);
		} catch (error) {
			console.error(error);
			await constantTime;
			res.status(500).send(internalErrorMessage);
		}
	}
);

authRouter.post<{}, {}, AuthRequest>(
	"/login",
	async (req: Request, res: Response) => {
		const constantTime = delay(100);
		try {
			const authService = new AuthService();
			const response: AuthResponse = await authService.login(req.body);
			await constantTime;
			res.status(200).send(response);
		} catch (error) {
			console.error(error);
			await constantTime;
			res.status(500).send(internalErrorMessage);
		}
	}
);

authRouter.get<{}, {}, {}>(
	"/",
	authMiddleware,
	(req: Request, res: Response) => {
		try {
			const authRes: AuthResponse = {
				complete: false,
				errors: [],
				jwt: null,
				user: null,
			};

			const user = req.claims ?? null;

			if (user) {
				const clientUser: ClientUser = {
					username: user.username,
					online: false,
				};

				const jwt = req.header("Authorization") || null;
				authRes.complete = true;
				authRes.jwt = jwt ? jwt.split(" ")[1] : null;
				authRes.user = clientUser;

				res.status(200).send(authRes);
			} else {
				authRes.complete = false;
				authRes.errors.push("Can't find user information.");
				res.status(401).send(authRes);
			}
		} catch (error) {
			console.error(error);
			res.status(500).send(internalErrorMessage);
		}
	}
);

authRouter.delete<{}, {}, AuthRequest>(
	"/",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			if (req.claims) {
				const adminService = new AdministrationService();
				await adminService.deleteAccountByUserId(req.claims.userId);
				res.status(200).send(true);
			}
		} catch (error) {
			res.status(500).send(false);
		}
	}
);

export default authRouter;
