import * as express from "express";

export default (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	// DOES NOT WORK LOL
	console.log("static", req.baseUrl);
	next(next);
};
