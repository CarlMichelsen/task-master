import express from "express";
import path from "path";
import { config } from "dotenv";

import verifyExists from "./verifyExists";

// load environment variables
config();

const startup = new Date(Date.now());
const app = express();
const port = isNaN(Number(process.env.PORT)) ? 80 : Number(process.env.PORT);

// health endpoint
app.get("/health", (req: express.Request, res: express.Response) => {
	res.send(true);
	console.log("healthcheck");
});

// run checks
const publicDir = path.join(__dirname, "public");
if (!verifyExists(publicDir)) throw new Error('Could not find "public" folder');
const indexF = path.join(__dirname, "public/index.html");
if (!verifyExists(indexF)) throw new Error('Could not find "index.html" file');

// serve website
app.use("/", express.static(publicDir, { redirect: true }));

// start webserver
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
	startup.setDate(Date.now());
});
