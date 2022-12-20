import { Router, Request, Response } from "express";

// middleware
import { authMiddleware } from "../middleware/authMiddleware";

const taskboardRouter = Router();

taskboardRouter.get("/", authMiddleware, (req: Request, res: Response) => {
	try {
		res.status(200).send(true);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default taskboardRouter;
