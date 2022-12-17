import { Router, Request, Response } from "express";

const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
	try {
		res.status(200).send(true);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default healthRouter;
