import { Router, Request, Response } from "express";

// models
import { ServiceResponse } from "models/serviceResponse";
import { ClientTaskboard } from "models/taskboard/clientTaskboard";

// middleware
import { authMiddleware } from "../middleware/authMiddleware";

// services
import { TaskboardService } from "../../services/taskboardService";

// etc
import { mapManyToClientTaskboards } from "../../mappers/clientTaskboardMapper";
import { CreateTaskboardRequest } from "models/taskboard/createTaskboardRequest";

const taskboardRouter = Router();

taskboardRouter.get(
	"/",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.claims?.userId;
			if (!userId) throw new Error("No userid in claims");
			const response = new ServiceResponse<ClientTaskboard[]>();
			const taskboardService = new TaskboardService();
			const taskboards = await taskboardService.getUserTaskboards(userId);
			response.ok = true;
			response.data = await mapManyToClientTaskboards(taskboards);
			res.status(200).send(response);
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal server error");
		}
	}
);

taskboardRouter.post<{}, {}, CreateTaskboardRequest>(
	"/",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const taskboardService = new TaskboardService();
			const createRequest = req.body as CreateTaskboardRequest | undefined;
			const response = await taskboardService.createTaskboard(
				req.claims?.userId,
				createRequest
			);
			console.log(response);
			res.status(200).send(response);
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal server error");
		}
	}
);

taskboardRouter.delete(
	"/:taskboardUri",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const uri = req.params.taskboardUri;
			const taskboardService = new TaskboardService();
			const servRes = await taskboardService.deleteTaskboardByUri(
				uri,
				req.claims?.userId
			);
			res.status(200).send(servRes);
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal server error");
		}
	}
);

export default taskboardRouter;
