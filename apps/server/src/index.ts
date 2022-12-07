import express from "express";
import path from "path";
import { config } from "dotenv";

import verifyExists from "./verifyExists";

// load environment variables
config();

const startup = new Date(Date.now());
const app = express();
const port = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);

// health endpoint
app.get("/health", (req: express.Request, res: express.Response) => {
	res.send(true);
	console.log("healthcheck");
});

// uptime endpoint
app.get("/uptime", (req: express.Request, res: express.Response) => {
	const rawSeconds = Date.now() - startup.getTime();
	const seconds = rawSeconds % 60;
	const minutes = Math.floor(rawSeconds / 60) % 60;
	const hours = Math.floor(rawSeconds / 60 / 60) % 24;
	const doubleDigit = (num: number) =>
		`${num.toString().length > 1 ? "" : "0"}${num}`;
	const value = `UPTIME: ${doubleDigit(hours)}.${doubleDigit(
		minutes
	)}.${doubleDigit(seconds)}`;
	res.send(value);
	console.log(value);
});

// serve website
const publicDir = path.join(__dirname, "public");
if (!verifyExists(publicDir))
	throw new Error('Could not find "public" folder...');
app.use("/", express.static(publicDir));

// start webserver
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
	startup.setDate(Date.now());
});
