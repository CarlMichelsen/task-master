import * as express from "express";

export const authGuardMiddleware = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.claims != null) {
		next();
	} else {
		res.status(401).send("Not authorized");
	}
};
