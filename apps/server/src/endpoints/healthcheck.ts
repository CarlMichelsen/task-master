import * as express from "express";

export default (req: express.Request, res: express.Response) => {
	console.log("healthcheck");
	res.send(true);
};
