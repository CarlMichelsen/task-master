import { Router, Request, Response } from "express";

// models
import { ServiceResponse } from "data-transfer-interfaces/serviceResponse";
import { ClientTaskboard } from "data-transfer-interfaces/taskboard/clientTaskboard";
import { CreateTaskboardRequest } from "data-transfer-interfaces/taskboard/createTaskboardRequest";

// middleware
import { authMiddleware } from "../middleware/authMiddleware";

// services
import { TaskboardService } from "../../services/taskboardService";

// etc
import {
	mapManyToClientTaskboards,
	mapToClientTaskboard,
} from "../../mappers/clientTaskboardMapper";

const taskboardRouter = Router();

taskboardRouter.get(
	"/",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.claims?.userId;
			if (!userId) throw new Error("No userid in claims");
			const response: ServiceResponse<ClientTaskboard[]> = {
				ok: false,
				errors: [],
			};
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

taskboardRouter.get(
	"/:uri",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.claims?.userId;
			if (!userId) throw new Error("No userid in claims");
			const uri = req.params.uri;
			const response: ServiceResponse<ClientTaskboard> = {
				ok: false,
				errors: [],
			};
			const taskboardService = new TaskboardService();
			const taskboard = await taskboardService.getTaskboardByUri(uri);
			if (taskboard) {
				response.ok = true;
				response.data = await mapToClientTaskboard(taskboard);
			}

			res.status(response.ok ? 200 : 404).send(response);
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
			if (response.ok)
				console.log(
					`${req.claims?.username} created a new taskboard "${createRequest?.taskboardName}"`
				);
			res.status(200).send(response);
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal server error");
		}
	}
);

taskboardRouter.post(
	"/leave/:uri",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const uri = req.params.uri;
			const taskboardService = new TaskboardService();
			const servRes = await taskboardService.leaveTaskboardByUri(
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

taskboardRouter.delete(
	"/:uri",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const uri = req.params.uri;
			const taskboardService = new TaskboardService();
			const servRes = await taskboardService.deleteTaskboardByUri(
				uri,
				req.claims?.userId
			);
			if (servRes.ok)
				console.log(
					`${req.claims?.username} deleted taskboard with uri <${servRes.data}>`
				);
			res.status(200).send(servRes);
		} catch (error) {
			console.error(error);
			res.status(500).send("Internal server error");
		}
	}
);

export default taskboardRouter;
