import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
	try {
		res.status(200).send(true);
	} catch (error) {
		console.error(error);
		res.status(200).send("Internal server error");
	}
});

export default healthRouter;
