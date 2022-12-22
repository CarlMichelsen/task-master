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

		let authorized = false;
		if (typeof authHeader === "string") {
			const jwt = authHeader.split(" ")[1];
			if (jwt) {
				const claims = AuthService.authenticate(jwt);
				if (claims) {
					req.claims = claims;
					authorized = true;
				}
			}
		}

		if (authorized) {
			next();
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (error) {
		res.status(401).send("Unauthorized");
	}
};
