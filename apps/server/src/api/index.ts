import { Router } from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);

export default router;
