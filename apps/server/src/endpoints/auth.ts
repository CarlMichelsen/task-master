import express from "express";

export default (req: express.Request, res: express.Response) => {
	console.log("auth");
	res.send(true);
};
