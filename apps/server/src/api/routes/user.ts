import { ClientUser } from "models/user/clientUser";
import { Router, Request, Response } from "express";

// middleware
import { authGuardMiddleware } from "../middleware/authGuardMiddleware";

const userRouter = Router();

userRouter.get("/self", authGuardMiddleware, (req: Request, res: Response) => {
	try {
		const claims = req.claims;
		if (claims) {
			const clientUser: ClientUser = {
				username: claims.username,
				online: false, // TODO: hook up to real data
			};

			res.status(200).send(clientUser);
		} else {
			res.status(404).send("Could not read authorization");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
});

export default userRouter;
