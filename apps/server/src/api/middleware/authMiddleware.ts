import * as express from "express";
import { AuthService } from "../../services/authService";

export const authMiddleware = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const authHeader: string | string[] | null =
			req.header("Authorization") || null;

		if (typeof authHeader === "string") {
			const jwt = authHeader.split(" ")[1];
			if (jwt) {
				const authService = new AuthService();
				const claims = authService.authenticate(jwt);
				if (claims) req.claims = claims;
			}
		}
	} catch (error) {
		console.error(error);
		res.status(401).send("Unauthorized");
	}

	next();
};
