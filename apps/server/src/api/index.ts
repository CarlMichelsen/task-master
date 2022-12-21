import { Router } from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import taskboardRouter from "./routes/taskboard";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/taskboard", taskboardRouter);

export default router;
