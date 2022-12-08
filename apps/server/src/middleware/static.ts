import express, { NextFunction } from "express";

export default (
	req: express.Request,
	res: express.Response,
	next: NextFunction
) => {
	// DOES NOT WORK LOL
	console.log("static", req.baseUrl);
	next(next);
};
