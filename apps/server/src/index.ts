import express from "express";
import path from "path";
import { config } from "dotenv";

import verifyExists from "./verifyExists";

// load environment variables
config();

const app = express();
const port = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);

// test endpoint
app.get("/test", (req: express.Request, res: express.Response) => {
	res.send({ test: "yes" });
	console.log("test");
});

// serve website
const publicDir = path.join(__dirname, "public");
if (!verifyExists(publicDir))
	throw new Error('Could not find "public" folder...');
app.use("/", express.static(publicDir));

// start webserver
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
